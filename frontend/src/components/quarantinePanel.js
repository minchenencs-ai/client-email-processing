export function renderQuarantinePanel(items, container) {
  if (!items || items.length === 0) {
    container.textContent = 'No quarantined items.'
    return
  }
  const ul = document.createElement('ul')
  items.forEach(it => {
    const li = document.createElement('li')
    li.textContent = `${it.id} • ${it.ts || ''} • ${it.result ? JSON.stringify(it.result) : JSON.stringify(it)}`
    ul.appendChild(li)
  })
  container.appendChild(ul)
}
