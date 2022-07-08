import test from "ava"

export interface BibTeX {
  type: string
  id: string
  [field: string]: string
}

export function parseBibtexString(citation: string): BibTeX {
  const metadataRegex = new RegExp('^@(\\w+)\\s?{(\\w+),')
  const metadataMatch = metadataRegex.exec(citation.trim().replace(/\n/g, ' '))
  if (metadataMatch === null) throw new Error('Cannot parse')
  const type = metadataMatch[1]
  const id = metadataMatch[2]

  const bibtex: BibTeX = {
    type,
    id,
  }

  const paramRegex = new RegExp('(\\w+)\\s?=\\s?{([\\w\\d\\s-{}.(),:;/]*)},?')
  let paramMatches = paramRegex.exec(citation)
  while (paramMatches !== null) {
    // Keep breaking apart the string until we're out
    const field = paramMatches[1]
    const value = paramMatches[2]
    bibtex[field] = value.trim().replace(/},$/, '')
    // Restart
    const index = citation.indexOf(paramMatches[0])
    citation = citation.substring(index + paramMatches[0].length)
    paramMatches = paramRegex.exec(citation)
  }
  return bibtex
}

export function getExternalLink(citation: BibTeX): string | undefined {
  if ('doi' in citation) return `https://doi.org/${citation.doi}`
  if ('url' in citation) return citation.url
  return undefined
}
