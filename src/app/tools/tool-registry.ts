export const tools = [
  'wiktionary',
  'quiver',
  'tables',
  'citations',
  'settings',
] as const

export const labels: Record<ToolId, string> = {
  wiktionary: 'Wiktionary',
  quiver: 'Figures',
  tables: 'Tables',
  citations: 'Citations',
  settings: '⚙',
}

export function isEnabled(tool: ToolId) {
  const lsId = `tool.registry.${tool}`
  return window.localStorage[lsId] === 'true' ||
    window.localStorage[lsId] === undefined
}

export function updateEnabled(tool: ToolId, enabled: boolean) {
  const lsId = `tool.registry.${tool}`
  return window.localStorage[lsId] = String(enabled)
}

export type ToolId = typeof tools[number] 