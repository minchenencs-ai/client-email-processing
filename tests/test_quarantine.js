const assert = require('assert')
const path = require('path')
const fs = require('fs')
const quarantine = require('../mock-api/quarantine')

function cleanup() {
  const file = path.join(__dirname, '..', 'mock-api', 'quarantine.json')
  if (fs.existsSync(file)) fs.unlinkSync(file)
}

async function run() {
  cleanup()
  const rec = quarantine.record({ source: 'test', reason: 'unit-test' })
  const list = quarantine.list()
  assert(Array.isArray(list))
  assert(list.length >= 1)
  assert(list.find(x => x.id === rec.id))
  console.log('test_quarantine: OK')
  cleanup()
}

run().catch(err => { console.error(err); process.exit(1) })
