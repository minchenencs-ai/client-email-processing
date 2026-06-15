const quarantine = require('../mock-api/quarantine')
const fs = require('fs')
const path = require('path')

describe('quarantine module', () => {
  const file = path.join(__dirname, '..', 'mock-api', 'quarantine.json')
  beforeEach(() => { if (fs.existsSync(file)) fs.unlinkSync(file) })
  afterEach(() => { if (fs.existsSync(file)) fs.unlinkSync(file) })

  it('records and lists entries', () => {
    const rec = quarantine.record({ source: 'test', reason: 'vitest' })
    const list = quarantine.list()
    expect(Array.isArray(list)).toBe(true)
    expect(list.some(x => x.id === rec.id)).toBe(true)
  })
})
