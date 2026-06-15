const fs = require('fs')
const path = require('path')

function loadTradeDB() {
  const dbPath = path.join(__dirname, '..', 'spec-inputs', 'api-trade-search-db.json')
  if (!fs.existsSync(dbPath)) return []
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
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

function searchBySecurityId(securityId) {
  if (!securityId) return []
  const trades = loadTradeDB()
  return trades.filter(t => t.security_id && t.security_id.toUpperCase() === securityId.toUpperCase())
}

function search(securityId) {
  if (!securityId) return []
  let matches = searchBySecurityId(securityId)
  if (matches.length === 0) {
    const trades = loadTradeDB()
    matches = trades.filter(t => t.security_id && t.security_id.toUpperCase().includes(securityId.toUpperCase()))
  }
  return matches
}

module.exports = { loadTradeDB, searchBySecurityId, search }
