export const tools = [
  'wiktionary',
  'quiver',
  'tables',
  'citations',
] as const

export const labels: Record<ToolId, string> = {
  wiktionary: 'Wiktionary',
  quiver: 'Figures',
  tables: 'Tables',
  citations: 'Citations',
}

export type ToolId = typeof tools[number] 