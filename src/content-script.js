console.debug('content-script')
/**
 * An array of scripts to be loaded into the primary page context.
 */
const scriptsToLoad = ['webpage-script.js'];
scriptsToLoad.forEach(script => {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL(script);
  (document.head || document.documentElement).appendChild(s);
  s.onload = function () {
    s.remove();
  };
});

function modifyHeight() {
  iframe.style.height = `${height}px`
  iframe.style.top = `calc(100vh - ${height}px)`
  toggler.style.top = `calc(100vh - ${height}px)`
  heightAdjuster.style.top = `calc(100vh - ${height}px - 32px)`
}

let isOpen = false
let height = 200
const defaultClosed = 48
const defaultOpen = 200
function toggle() {
  isOpen = !isOpen
  if (isOpen) {
    modifyHeight()
    heightAdjuster.style.display = 'block'
    toggler.innerText = '▼'
  } else {
    iframe.style.height = `${defaultClosed}px` // TODO: Make this flexible
    iframe.style.top = `calc(100vh - ${defaultClosed}px)`
    toggler.style.top = `calc(100vh - ${defaultClosed}px)`
    toggler.innerText = '▲'
    heightAdjuster.style.display = 'none'
  }
}

let isAdjust = false
function adjustEnter(e) {
  isAdjust = true
}

function adjustExit() {
  isAdjust = false
}

function adjustHeight(ev) {
  if (isAdjust) {
    height = window.innerHeight - ev.clientY - 12 // Since we're going from bottom
    console.debug('Adjust height to', height)
    modifyHeight()
    console.log(ev)
  }
}

const toggler = document.createElement('button')
toggler.innerText = '▲'
toggler.style.position = 'fixed'
toggler.style.zIndex = 999
toggler.style.top = `calc(100vh - ${defaultClosed}px)`
toggler.style.right = '0px'
toggler.style.background = 'none'
toggler.style.color = 'white'
toggler.style.border = 'none'
toggler.onclick = toggle
document.body.appendChild(toggler)

const heightAdjuster = document.createElement('div')
heightAdjuster.innerText = '⋯'
heightAdjuster.style.position = 'fixed'
heightAdjuster.style.zIndex = 999
heightAdjuster.style.display = 'none' // Reset
heightAdjuster.style.textAlign = 'center'
heightAdjuster.style.top = `calc(100vh - ${defaultClosed}px)`
heightAdjuster.style.left = '0px'
heightAdjuster.style.width = '100vw'
heightAdjuster.style.height= '36px' // Give us enough space to hold mouse
heightAdjuster.style.background = '#333'
heightAdjuster.style.border = 'solid 1px black'
heightAdjuster.style.cursor = 'ns-resize'
heightAdjuster.style.fontSize = 'x-large'
heightAdjuster.style.color = 'white'
heightAdjuster.onmousedown = adjustEnter
heightAdjuster.onmousemove = adjustHeight
heightAdjuster.onmouseup = adjustExit
document.body.appendChild(heightAdjuster)

const iframe = document.createElement('iframe')
iframe.src = 'http://localhost:4200' // TODO: Update at some point
iframe.style.position = 'fixed'
iframe.style.zIndex = 998
iframe.style.width = '100vw'
iframe.style.height = `${defaultClosed}px`
iframe.style.top = `calc(100vh - ${defaultClosed}px)`
iframe.style.border = 'none'
iframe.style.borderTop = 'solid 1px #999'
iframe.style.boxShadow = 'white 0px -1px 7px -5px'
document.body.appendChild(iframe)
