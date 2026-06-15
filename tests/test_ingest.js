const assert = require('assert')
const ingest = require('../mock-api/ingest')

async function run() {
  const email = {
    id: 'test-1',
    subject: 'Please execute trade',
    body: 'Please trade 100 shares of ABCD at $10',
    sender: 'trader@example.com'
  }

  const r = await ingest.processEmail(email)
  console.log('ingest result:', r)
  assert(r.classification && typeof r.classification.confidence === 'number')
  if (r.overall_status === 'quarantined') {
    console.log('Ingest quarantined as expected for low-confidence or parse issues')
  }
  // overall_status should be one of known states
  assert(['matched', 'partial', 'unmatched', 'quarantined'].includes(r.overall_status))
  console.log('test_ingest: OK')
}

run().catch(err => { console.error(err); process.exit(1) })
