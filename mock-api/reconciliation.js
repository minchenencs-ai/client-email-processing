function reconcile(extracted, chosen, options = {}) {
  const tol = typeof options.priceTol === 'number' ? options.priceTol : 0.005
  const attribute_results = {}

  // security id
  attribute_results.security_id = (chosen.security_id && extracted.security_id && chosen.security_id.toUpperCase() === extracted.security_id.toUpperCase()) ? 'match' : 'mismatch'

  // quantity
  attribute_results.quantity = (chosen.quantity != null && extracted.quantity != null && Number(chosen.quantity) === Number(extracted.quantity)) ? 'match' : 'mismatch'

  // price (relative tolerance)
  if (chosen.price != null && extracted.price != null) {
    const c = Number(chosen.price)
    const e = Number(extracted.price)
    attribute_results.price = (Math.abs(c - e) / (Math.abs(c) || 1) <= tol) ? 'match' : 'mismatch'
  } else {
    attribute_results.price = 'unknown'
  }

  const okCount = Object.values(attribute_results).filter(v => v === 'match').length
  const overall_status = okCount >= 2 ? 'matched' : (okCount === 1 ? 'partial' : 'unmatched')

  return { attribute_results, overall_status }
}

module.exports = { reconcile }
