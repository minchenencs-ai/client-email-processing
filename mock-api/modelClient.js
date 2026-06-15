const fs = require('fs')
const path = require('path')

// Lightweight pluggable model client.
// If OPENAI_API_KEY (or MODEL_PROVIDER) is configured, this module should be
// extended to call the remote provider. By default (no key), it runs a
// deterministic, prompt-driven simulator to keep behavior reproducible for tests.

function _loadTemplate(name) {
  try {
    const p = path.join(__dirname, 'prompt_templates', name)
    return fs.readFileSync(p, 'utf8')
  } catch (err) {
    return ''
  }
}

async function _simulateClassification(prompt) {
  // Extract the input section heuristically
  const m = prompt.match(/INPUT:\s*([\s\S]*)/i)
  const text = (m && m[1]) ? m[1].trim().toLowerCase() : prompt.toLowerCase()

  if (!text) return { intent: 'unknown', confidence: 0.0 }
  if (text.includes('trade') || text.includes('buy') || text.includes('sell') || /\bshares\b/.test(text) || /\bqty\b/.test(text)) {
    return { intent: 'trade_inquiry', confidence: 0.92 }
  }
  if (text.includes('support') || text.includes('help') || text.includes('issue')) {
    return { intent: 'support', confidence: 0.88 }
  }
  if (text.includes('cancel') || text.includes('amend')) {
    return { intent: 'amendment', confidence: 0.80 }
  }
  return { intent: 'unknown', confidence: 0.52 }
}

async function _simulateExtraction(prompt) {
  const m = prompt.match(/INPUT:\s*([\s\S]*)/i)
  const text = (m && m[1]) ? m[1].trim() : prompt

  const out = {
    security_id: null,
    trade_date: null,
    settlement_date: null,
    quantity: null,
    price: null,
    counterparty: null,
    account: null,
    currency: null
  }

  // quantity
  const qtyMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?=\s*(?:shares|units|lots|qty|qty:)?)/i)
  if (qtyMatch) out.quantity = Number(qtyMatch[1].replace(/,/g, ''))

  // price
  const priceMatch = text.match(/[\$€£]\s?(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/)
  if (priceMatch) out.price = Number(priceMatch[1].replace(/,/g, ''))

  // security id: uppercase token 3-12
  const tokens = (text.match(/\b[A-Z0-9]{3,12}\b/g) || []).filter(t => /[A-Z]/.test(t))
  if (tokens.length) out.security_id = tokens[0]

  // dates yyyy-mm-dd or dd/mm/yyyy
  const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/)
  if (dateMatch) out.trade_date = dateMatch[1]

  return out
}

async function classify(text) {
  // Build prompt from template for clarity and reproducibility
  const template = _loadTemplate('classification.txt') || 'Classify the following email.\nINPUT: {{INPUT}}\n'
  const prompt = template.replace('{{INPUT}}', text)

  // If a provider key exists, integrate with external API here.
  if (process.env.OPENAI_API_KEY || process.env.MODEL_PROVIDER) {
    // Placeholder: real provider integration would go here.
    // For now, fall back to simulation to keep tests deterministic.
    return _simulateClassification(prompt)
  }

  return _simulateClassification(prompt)
}

async function extract(text) {
  const template = _loadTemplate('extraction.txt') || 'Extract trade fields from the following email.\nINPUT: {{INPUT}}\n'
  const prompt = template.replace('{{INPUT}}', text)
  if (process.env.OPENAI_API_KEY || process.env.MODEL_PROVIDER) {
    // Placeholder for real model call
    return _simulateExtraction(prompt)
  }
  return _simulateExtraction(prompt)
}

module.exports = { classify, extract }
