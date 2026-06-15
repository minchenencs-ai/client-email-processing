const assert = require('assert')
const classifier = require('../mock-api/intentClassifier')

async function run() {
  const r1 = await classifier.classify('Please help, I want to trade 100 shares')
  assert.strictEqual(r1.intent, 'trade_inquiry')
  assert(r1.confidence > 0.8)

  const r2 = await classifier.classify('I need support with my account')
  assert.strictEqual(r2.intent, 'support')

  const r3 = await classifier.classify('random text with no meaning')
  assert(r3.confidence < 0.7)

  console.log('test_classifier: OK')
}

run().catch(err => { console.error(err); process.exit(1) })
