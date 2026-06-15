const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, 'quarantine.json')

function _read() {
  if (!fs.existsSync(FILE)) return []
  try {
    const raw = fs.readFileSync(FILE, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (err) {
    return []
  }
}

function _write(arr) {
  fs.writeFileSync(FILE, JSON.stringify(arr, null, 2), 'utf8')
}

function list() {
  return _read()
}

function record(item) {
  const arr = _read()
  const entry = Object.assign({ id: Date.now().toString(36) }, item)
  arr.push(entry)
  _write(arr)
  return entry
}

module.exports = { list, record }
