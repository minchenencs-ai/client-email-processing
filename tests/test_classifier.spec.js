const classifier = require('../mock-api/intentClassifier')

describe('intentClassifier', () => {
  it('detects trade_inquiry with high confidence', async () => {
    const r = await classifier.classify('Please help, I want to trade 100 shares')
    expect(r.intent).toBe('trade_inquiry')
    expect(r.confidence).toBeGreaterThan(0.8)
  })

  it('detects support intent', async () => {
    const r = await classifier.classify('I need support with my account')
    expect(r.intent).toBe('support')
  })
})
