const parser = require('../mock-api/parser')

describe('parser.parseRawEmail', () => {
  it('parses subject, from, date, and body from simple raw eml', async () => {
    const raw = `Subject: Test email\r\nFrom: Alice <alice@example.com>\r\nDate: Tue, 15 Jun 2026 12:00:00 +0000\r\n\r\nHello world\nThis is a test.`
    const p = await parser.parseRawEmail(raw)
    expect(p.subject).toBe('Test email')
    expect(p.sender).toContain('alice@example.com')
    expect(p.body).toContain('Hello world')
    expect(p.sent_timestamp).toMatch(/^2026-06-15T12:00:00/)
  })
})
