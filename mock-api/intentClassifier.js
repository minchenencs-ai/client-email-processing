// Intent classifier — delegate to model client so classification is prompt-driven
const modelClient = require('./modelClient')

async function classify(text) {
  return modelClient.classify(text)
}

module.exports = { classify }
