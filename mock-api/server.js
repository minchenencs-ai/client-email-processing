const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const intentClassifier = require('./intentClassifier')
const quarantine = require('./quarantine')
const ingest = require('./ingest')

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', () => {
      if (!body) return resolve(null)
      try {
        resolve(JSON.parse(body))
      } catch (err) {
        return reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJSON(res, obj, code = 200) {
  const payload = JSON.stringify(obj, null, 2)
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(payload)
}

function serveStatic(req, res) {
  const parsed = url.parse(req.url)
  const safePath = path.normalize(parsed.pathname).replace(/^\.\./, '')
  let rel = safePath === '/' ? '/index.html' : safePath
  const filePath = path.join(__dirname, '..', 'frontend', rel)
  if (!fs.existsSync(filePath)) return false
  const ext = path.extname(filePath).toLowerCase()
  const map = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' }
  const contentType = map[ext] || 'application/octet-stream'
  const data = fs.readFileSync(filePath)
  res.writeHead(200, { 'Content-Type': contentType })
  res.end(data)
  return true
}

function handler(req, res) {
  const parsed = url.parse(req.url, true)
  const method = req.method || 'GET'
  if (parsed.pathname === '/api/health' && method === 'GET') {
    return sendJSON(res, { ok: true })
  }

  if (parsed.pathname === '/api/trades' && method === 'GET') {
    const dbPath = path.join(__dirname, '..', 'spec-inputs', 'api-trade-search-db.json')
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      return sendJSON(res, data)
    }
    return sendJSON(res, { trades: [] })
  }

  if (parsed.pathname === '/api/classify' && method === 'POST') {
    return parseJSONBody(req)
      .then(async body => {
        const text = (body && (body.text || body.body || body.subject)) || ''
        const result = await intentClassifier.classify(text)
        // quarantine low-confidence
        if (result.confidence < 0.6) {
          await quarantine.record({ source: 'classifier', text, result, ts: new Date().toISOString() })
        }
        return sendJSON(res, { classification: result })
      })
      .catch(err => sendJSON(res, { error: String(err) }, 400))
  }

  if (parsed.pathname === '/api/quarantine' && method === 'GET') {
    const list = quarantine.list()
    return sendJSON(res, { items: list })
  }

  if (parsed.pathname === '/api/quarantine' && method === 'POST') {
    return parseJSONBody(req)
      .then(body => {
        const rec = quarantine.record(Object.assign({ ts: new Date().toISOString() }, body || {}))
        return sendJSON(res, { recorded: rec })
      })
      .catch(err => sendJSON(res, { error: String(err) }, 400))
  }

  if (parsed.pathname === '/api/ingest' && method === 'POST') {
    return parseJSONBody(req)
      .then(async body => {
        const result = await ingest.processEmail(body || {})
        return sendJSON(res, result)
      })
      .catch(err => sendJSON(res, { error: String(err) }, 400))
  }

  // Fallback: serve frontend static files
  if (serveStatic(req, res)) return

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'not_found' }))
}

function start(port = 3000) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handler)
    server.on('error', reject)
    server.listen(port, () => resolve(server))
  })
}

if (require.main === module) {
  start(3000).then(() => console.log('mock-api server running on http://localhost:3000'))
}

module.exports = { start }
