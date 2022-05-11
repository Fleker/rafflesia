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

let isOpen = false
function toggle() {
  isOpen = !isOpen
  if (isOpen) {
    iframe.style.height = '200px' // TODO: Make this flexible
    iframe.style.top = 'calc(100vh - 200px)'
    toggler.style.top = 'calc(100vh - 200px)'
    toggler.innerText = '▼'
  } else {
    iframe.style.height = '48px' // TODO: Make this flexible
    iframe.style.top = 'calc(100vh - 48px)'
    toggler.style.top = 'calc(100vh - 48px)'
    toggler.innerText = '▲'
  }
}

const toggler = document.createElement('button')
toggler.innerText = '▲'
toggler.style.position = 'fixed'
toggler.style.zIndex = 999
toggler.style.top = 'calc(100vh - 48px)'
toggler.style.right = '0px'
toggler.style.background = 'none'
toggler.style.color = 'white'
toggler.style.border = 'none'
toggler.onclick = toggle
document.body.appendChild(toggler)

const iframe = document.createElement('iframe')
iframe.src = 'http://localhost:4200' // TODO: Update at some point
iframe.style.position = 'fixed'
iframe.style.zIndex = 998
iframe.style.width = '100vw'
iframe.style.height = '48px' // TODO: Make this flexible
iframe.style.top = 'calc(100vh - 48px)'
iframe.style.border = 'none'
iframe.style.borderTop = 'solid 1px #999'
iframe.style.boxShadow = 'white 0px -1px 7px -5px'
document.body.appendChild(iframe)
