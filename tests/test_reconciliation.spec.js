const recon = require('../mock-api/reconciliation')

describe('reconciliation', () => {
  it('matches security and quantity and price', () => {
    const extracted = { security_id: 'ABCD', quantity: 100, price: 10 }
    const chosen = { security_id: 'ABCD', quantity: 100, price: 10 }
    const r = recon.reconcile(extracted, chosen)
    expect(r.attribute_results.security_id).toBe('match')
    expect(r.attribute_results.quantity).toBe('match')
    expect(r.attribute_results.price).toBe('match')
    expect(r.overall_status).toBe('matched')
  })

  it('flags mismatches', () => {
    const extracted = { security_id: 'WXYZ', quantity: 100, price: 10 }
    const chosen = { security_id: 'ABCD', quantity: 10, price: 9.9 }
    const r = recon.reconcile(extracted, chosen)
    expect(r.attribute_results.security_id).toBe('mismatch')
    expect(r.attribute_results.quantity).toBe('mismatch')
    expect(r.overall_status).toBe('unmatched')
  })
})
