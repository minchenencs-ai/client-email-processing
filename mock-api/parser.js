let simpleParser = null
try {
  ;({ simpleParser } = require('mailparser'))
} catch (err) {
  simpleParser = null
}

async function parseRawEmail(raw) {
  // If mailparser is available, use it; otherwise use a simple fallback
  if (simpleParser) {
    try {
      const parsed = await simpleParser(raw)
      return {
        subject: parsed.subject || null,
        sender: (parsed.from && parsed.from.value && parsed.from.value[0] && parsed.from.value[0].address) || null,
        sent_timestamp: parsed.date ? parsed.date.toISOString() : null,
        body: parsed.text || (parsed.html ? parsed.html.replace(/<[^>]+>/g, '') : null),
        raw_payload: raw
      }
    } catch (err) {
      // fall through to fallback
    }
  }

  // Fallback simple parser: headers until blank line, body after
  const parts = raw.split(/\r?\n\r?\n/)
  const header = parts[0] || ''
  const body = parts.slice(1).join('\n\n') || null
  const subjMatch = header.match(/^Subject:\s*(.*)$/im)
  const fromMatch = header.match(/^From:\s*(.*)$/im)
  const dateMatch = header.match(/^Date:\s*(.*)$/im)
  return {
    subject: subjMatch ? subjMatch[1].trim() : null,
    sender: fromMatch ? (fromMatch[1].trim().replace(/"/g, '')) : null,
    sent_timestamp: dateMatch ? new Date(dateMatch[1].trim()).toISOString() : null,
    body: body,
    raw_payload: raw
  }
}

module.exports = { parseRawEmail }
