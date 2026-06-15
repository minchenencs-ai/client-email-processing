function info(obj) {
  try {
    const out = Object.assign({ level: 'info', ts: new Date().toISOString() }, obj)
    console.log(JSON.stringify(out))
  } catch (err) {
    console.log(JSON.stringify({ level: 'info', ts: new Date().toISOString(), msg: String(obj) }))
  }
}

function error(obj) {
  try {
    const out = Object.assign({ level: 'error', ts: new Date().toISOString() }, obj)
    console.error(JSON.stringify(out))
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', ts: new Date().toISOString(), msg: String(obj) }))
  }
}

module.exports = { info, error }
