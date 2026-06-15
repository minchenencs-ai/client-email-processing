const { start } = require('./server')
const http = require('http')

function requestJson(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let data = ''
      res.on('data', c => (data += c))
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          resolve(data)
        }
      })
    })
    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

;(async function run() {
  const server = await start(0)
  const port = server.address().port
  console.log('started on', port)

  const health = await requestJson({ hostname: '127.0.0.1', port, path: '/api/health', method: 'GET' })
  console.log('health:', health)

  const classify = await requestJson({ hostname: '127.0.0.1', port, path: '/api/classify', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { text: 'Please help, I want to trade 100 shares' })
  console.log('classify:', classify)

  const ingest = await requestJson({ hostname: '127.0.0.1', port, path: '/api/ingest', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { id: 's1', subject: 'Trade 100 ABCD', body: 'Please trade 100 shares of ABCD at $10' })
  console.log('ingest:', ingest)

  const quarantine = await requestJson({ hostname: '127.0.0.1', port, path: '/api/quarantine', method: 'GET' })
  console.log('quarantine:', quarantine)

  server.close()
})().catch(err => {
  console.error(err)
  process.exit(1)
})
