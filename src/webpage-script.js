console.debug('webpage-script')

function getDocumentId() {
  // Note: Might be different than the URL
  return window._ide.project_id
}

function geCurrentDocumentHash() {
  // For use jumpToDocument hash
  return window._ide.editorManager.getCurrentDocId()
}

function getEntireDocContents() {
  return window._ide.editorManager.getCurrentDocValue()
}

function jumpToLine(num, col=0) {
  // Note: This returns some sort of editor event that I don't know how to use
  return window._ide.editorManager.$scope.$broadcast('editor:gotoLine', num, col, true)
}

function getDocumentMetadata() {
  return window._ide.fileTreeManager['$scope']
}

function getAllProjectFiles() {
  return window._ide.fileTreeManager['$scope'].rootFolder.children
}

function createFileNamed(filename) {
  window._ide.fileTreeManager.createDoc(filename)
}

function getDependencies() {
  return window._ide.metadataManager.metadata.getAllPackages()
}

function getProjectOutline() {
  return window._ide.outlineManager.flatOutline
}

function openFile(filename) {
  const document = window._ide.fileTreeManager.findEntityByPath(filename)
  window._ide.editorManager.openDoc(document)
}

function showNativeAlert(title, body) {
  // Shows message and an OK
  return window._ide.showGenericMessageModal(title, body)
}

function showNativeLockedAlert(title, body) {
  // This returns an object with some functions but I cannot seem to
  // call the functions to dismiss
  return window._ide.showLockEditorMessageModal(title, body)
}

function showNativeRefreshAlert(title, body, error) {
  // This returns an object with some functions but I cannot seem to
  // call the functions to dismiss
  return window._ide.showOutOfSyncModal(title, body, error)
}

function openCommandPrompt() {
  window._debug_editors[0].prompt({$type: 'gotoLine'})
}

function insertText(row, col, text) {
  window._debug_editors[0].clearSelection()
  window._debug_editors[0].moveCursorTo(row - 1, col)
  window._debug_editors[0].insert(text)
}

function deleteText(row1, col1, row2, col2) {
  window._debug_editors[0].moveCursorTo(row1 - 1, col1)
  window._debug_editors[0].selection.moveCursorTo(row2 - 1, col2)
  window._debug_editors[0].remove()
}

function getNumberOfLines() {
  const page = window._ide.editorManager.getCurrentDocValue()
  const lines = page.split('\n')
  return lines.length
}

function getNumberOfCols(lineNo) {
  const page = window._ide.editorManager.getCurrentDocValue()
  const lines = page.split('\n')
  return lines[lineNo - 1].length
}

/* Other interesting functions
 * - window._debug_editors[0].find('string') <- returns object to use with `findNext` and `findPrevious`
 *
 */

function recompile() {
  // Just do it the easy way
  document.querySelector('.btn-recompile').click()
}

// Add event listeners into the Overleaf page that can respond to events from
// our external site.
window.addEventListener('message', (e) => {
  const {data} = e
  const parsedEvent = data
  const parsedData = parsedEvent.data
  console.debug('Received event', parsedEvent.type)
  switch (parsedEvent.type) {
    case 'rafflesia_copy':
      navigator.clipboard.writeText(parsedData)
      break
    case 'rafflesia_insert':
      const lineCount = getNumberOfLines()
      const colCount = getNumberOfCols(lineCount)
      jumpToLine(lineCount, colCount)
      insertText(lineCount, colCount, '\n\n' + parsedData)
      break
    case 'rafflesia_open':
      openFile(parsedData)
      break
    case 'rafflesia_create':
      createFileNamed(parsedData)
      setTimeout(() => {
        e.source.postMessage({
          type: 'rafflesia_getProjectFiles',
          data: getAllProjectFiles(),
        }, e.origin)
      }, 1000)
      break
    case 'rafflesia_getProjectFiles':
      e.source.postMessage({
        type: 'rafflesia_getProjectFiles',
        data: getAllProjectFiles(),
      }, e.origin)
      break
    case 'rafflesia_read':
      e.source.postMessage({
        type: 'rafflesia_read',
        data: getEntireDocContents(),
      }, e.origin)
      break
    case 'rafflesia_goto':
      jumpToLine(parsedData, 0)
      break;
  }
})
