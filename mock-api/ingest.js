const fs = require('fs')
const path = require('path')
const intentClassifier = require('./intentClassifier')
const quarantine = require('./quarantine')

function parseNumber(str) {
  if (!str) return null
  const cleaned = str.replace(/,/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

function extractTrade(text) {
  const out = { security_id: null, quantity: null, price: null }
  if (!text) return out
  // quantity: look for '100', '100 shares', etc.
  const qtyMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?=\s*(?:shares|sh|units|lots|qty|qty:)?)/i)
  if (qtyMatch) out.quantity = parseNumber(qtyMatch[1])

  // price: look for $12.34 or €12.34
  const priceMatch = text.match(/[\$€£]\s?(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/)
  if (priceMatch) out.price = parseNumber(priceMatch[1])

  // security id: find uppercase tokens length 3-12
  const tokens = (text.match(/\b[A-Z0-9]{3,12}\b/g) || []).filter(t => /[A-Z]/.test(t))
  if (tokens.length) out.security_id = tokens[0]

  return out
}

function loadTradeDB() {
  const dbPath = path.join(__dirname, '..', 'spec-inputs', 'api-trade-search-db.json')
  if (!fs.existsSync(dbPath)) return []
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    // support different shapes: prefer flat `trades`, otherwise flatten nested transaction responses
    if (Array.isArray(data.trades)) return data.trades
    if (Array.isArray(data.trade_search_transactions)) {
      const out = []
      data.trade_search_transactions.forEach(tx => {
        if (!tx.api_calls) return
        tx.api_calls.forEach(call => {
          const resp = call.response
          if (resp && Array.isArray(resp.trades)) out.push(...resp.trades)
        })
      })
      return out
    }
    return []
  } catch (err) {
    return []
  }
}

async function processEmail(email) {
  const text = [email.subject, email.body, email.raw_payload].filter(Boolean).join(' ')
  const classification = await intentClassifier.classify(text)
  const extracted = extractTrade(text)

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
    return result
  }

  if (!extracted.security_id || !extracted.quantity) {
    quarantine.record({ source: 'ingest:parser', email, extracted, ts: new Date().toISOString() })
    result.overall_status = 'quarantined'
    return result
  }

  const trades = loadTradeDB()
  let matches = trades.filter(t => t.security_id && t.security_id.toUpperCase() === extracted.security_id.toUpperCase())
  if (matches.length === 0) {
    // fallback: substring match
    matches = trades.filter(t => t.security_id && t.security_id.toUpperCase().includes(extracted.security_id.toUpperCase()))
  }

  const chosen = matches[0]
  if (!chosen) {
    result.overall_status = 'unmatched'
    return result
  }

  result.retrieved_trade_id = chosen.id || chosen.trade_id || null
  // compare attributes
  result.attribute_results.security_id = (chosen.security_id && chosen.security_id.toUpperCase() === extracted.security_id.toUpperCase()) ? 'match' : 'mismatch'
  result.attribute_results.quantity = (chosen.quantity != null && extracted.quantity != null && Number(chosen.quantity) === Number(extracted.quantity)) ? 'match' : 'mismatch'
  if (chosen.price != null && extracted.price != null) {
    const tol = 0.005
    result.attribute_results.price = (Math.abs(Number(chosen.price) - Number(extracted.price)) / Number(chosen.price) <= tol) ? 'match' : 'mismatch'
  } else {
    result.attribute_results.price = 'unknown'
  }

  // overall: require at least security_id and quantity match
  const okCount = Object.values(result.attribute_results).filter(v => v === 'match').length
  result.overall_status = okCount >= 2 ? 'matched' : (okCount === 1 ? 'partial' : 'unmatched')

  return result
}

module.exports = { processEmail }
