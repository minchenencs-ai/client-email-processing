const fs = require('fs')
const path = require('path')
const intentClassifier = require('./intentClassifier')
const modelClient = require('./modelClient')
const quarantine = require('./quarantine')
const logger = require('./logger')
const tradeSearch = require('./tradeSearchClient')
const reconciliation = require('./reconciliation')

function parseNumber(str) {
  if (!str) return null
  const cleaned = str.replace(/,/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

// extraction delegated to modelClient to satisfy prompt-based, model-driven requirement
async function extractTrade(text) {
  const extracted = await modelClient.extract(text)
  // normalize keys to expected output shape
  return {
    security_id: extracted.security_id || null,
    quantity: extracted.quantity || null,
    price: extracted.price || null
  }
}

// tradeSearch and reconciliation modules encapsulate DB access and compare logic

async function processEmail(email) {
  const text = [email.subject, email.body, email.raw_payload].filter(Boolean).join(' ')
  const classification = await intentClassifier.classify(text)
  const extracted = await extractTrade(text)

  const result = {
    email_trade_id: email.id || null,
    classification,
    extracted,
    retrieved_trade_id: null,
    attribute_results: {},
    overall_status: 'unmatched'
  }

  if (classification.confidence < 0.6) {
    quarantine.record({ source: 'ingest:classifier', email, classification, ts: new Date().toISOString() })
    result.overall_status = 'quarantined'
    logger.info({ event: 'ingest.quarantined', reason: 'low_classification_confidence', email_id: result.email_trade_id, confidence: classification.confidence })
    return result
  }

  if (!extracted.security_id || !extracted.quantity) {
    quarantine.record({ source: 'ingest:parser', email, extracted, ts: new Date().toISOString() })
    result.overall_status = 'quarantined'
    logger.info({ event: 'ingest.quarantined', reason: 'missing_extracted_fields', email_id: result.email_trade_id, extracted })
    return result
  }

  const trades = tradeSearch.search(extracted.security_id)
  const chosen = trades[0]
  if (!chosen) {
    result.overall_status = 'unmatched'
    logger.info({ event: 'ingest.unmatched', email_id: result.email_trade_id, extracted })
    return result
  }

  result.retrieved_trade_id = chosen.id || chosen.trade_id || null
  const recon = reconciliation.reconcile(extracted, chosen)
  result.attribute_results = recon.attribute_results
  result.overall_status = recon.overall_status
  logger.info({ event: 'ingest.result', email_id: result.email_trade_id, retrieved_trade_id: result.retrieved_trade_id, overall_status: result.overall_status })

  return result
}

module.exports = { processEmail }
