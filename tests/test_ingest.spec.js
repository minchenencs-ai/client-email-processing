const ingest = require('../mock-api/ingest')

describe('ingest.processEmail', () => {
  it('processes a simple trade email', async () => {
    const email = { id: 't1', subject: 'Trade 100 ABCD', body: 'Please trade 100 shares of ABCD at $10' }
    const r = await ingest.processEmail(email)
    expect(r).toHaveProperty('classification')
    expect(['matched', 'partial', 'unmatched', 'quarantined']).toContain(r.overall_status)
  })
})
