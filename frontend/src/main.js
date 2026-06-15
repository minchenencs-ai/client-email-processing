import { renderQuarantinePanel } from './components/quarantinePanel.js'

const emailText = document.getElementById('emailText')
const btnClassify = document.getElementById('btnClassify')
const btnQuarantine = document.getElementById('btnQuarantine')
const result = document.getElementById('result')

btnClassify.addEventListener('click', async () => {
  const text = emailText.value
  result.textContent = 'Classifying...'
  try {
    const res = await fetch('/api/classify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
    const data = await res.json()
    result.textContent = JSON.stringify(data, null, 2)
  } catch (err) {
    result.textContent = String(err)
  }
})

btnQuarantine.addEventListener('click', async () => {
  result.textContent = 'Loading quarantine...'
  try {
    const res = await fetch('/api/quarantine')
    const data = await res.json()
    result.innerHTML = ''
    renderQuarantinePanel(data.items || [], result)
  } catch (err) {
    result.textContent = String(err)
  }
})
