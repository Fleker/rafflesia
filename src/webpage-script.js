console.debug('webpage-script')

// Add event listeners into the Overleaf page that can respond to events from
// our external site.
document.addEventListener('message', (e) => {
  console.log('Received event rafflesia_copy', e)
  const {data} = e
  const parsedData = JSON.parse(data)
  const {type, data} = parsedData
  switch (type) {
    case 'rafflesia_copy':
      navigator.clipboard.writeText(data)
      break
  }
})
