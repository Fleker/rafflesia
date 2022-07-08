import { HttpsCallableResult } from "@firebase/functions"
import { FirebaseService } from "./firebase.service"

export interface CitationMisc {
  id: string
  title: string
  author: {
    first: string
    last?: string
  }[]
  journal?: string
  publisher?: string
  year?: string
  month?: string
  url: string
}

export function getId(articleUrl: string) {
  const arr = articleUrl.split('/')
  const lastPath = arr[arr.length - 1]
  return lastPath.substring(0, 24) // Have some upperbound to size
    || articleUrl.substring(0, 24) // Default to just the base URL
}

export function getTitles(html: string) {
  const titleRegex = html.match(/<title>(.*)<\/title>/)
  if (!titleRegex) {
    return {
      title: 'Unknown',
      publisher: undefined
    }
  }
  const fullTitle = titleRegex[1].trim()
    .replace(/&nbsp;/g, ' ')
    .replace('&mdash;', '—')
    .replace('<title>', '')
    .replace('</title>', '')
  const publisherSplit = fullTitle.split('|')
  if (publisherSplit.length >= 2) {
    return {
      title: publisherSplit[0].trim(),
      publisher: publisherSplit[1].trim(),
    }
  }

  return {
    title: fullTitle,
    pubisher: undefined,
  }
}

export function getAuthors(html: string) {
  const parselyRegex = html.match(/<meta name="parsely-author" content="(.*)">/)
  if (!parselyRegex) {
    return [{first: 'Unknown'}]
  }
  const fullAuthor = parselyRegex[1].trim()
    .replace(/>/g, '') // Only works for first author
  const authorSplit = fullAuthor.split(' ')
  if (authorSplit.length === 2) {
    return [{
      first: authorSplit[0],
      last: authorSplit[1],
    }]
  } else {
    // Breaks if the author's name is not 2 names
    return [{
      first: fullAuthor,
    }]
  }
}

export function authorsToBibtex(citation: CitationMisc) {
  let out = ''
  for (let i = 0; i < citation.author.length; i++) {
    const author = citation.author[i]
    if (author.last) {
      out += `${author.last}, `
    }
    out += `${author.first}`
    if (i < citation.author.length - 1) {
      out += ' and '
    }
  }
  return out
}

export function citationToBibtex(citation: CitationMisc) {
  const authors = authorsToBibtex(citation)
  let out = `@misc{${citation.id}, title={${citation.title}}, author={${authors}}, url={${citation.url}}`
  if (citation.journal) {
    out += `, journal={${citation.journal}}`
  }
  if (citation.publisher) {
    out += `, publisher={${citation.publisher}}`
  }
  if (citation.year) {
    out += `, year={${citation.year}}`
  }
  if (citation.month) {
    out += `, month={${citation.month}}`
  }
  out += '}'
  return out
}

export async function getDirectHTML(firebase: FirebaseService, url: string): Promise<string> {
  const fnc = await firebase.getFunction('proxy')
  const res = await fnc({url}) as HttpsCallableResult<string>
  return await res.data
}

/**
 * This function may add special logic when citing specific websites.
 * @param url URL of the document to reference
 */
export async function linkCitePreprocessor(firebase: FirebaseService, fetch: Function, url: string) {
  if (url.includes('ieeexplore.ieee.org/document')) {
    const fnc = await firebase.getFunction('proxy')
    const res = await fnc({url}) as HttpsCallableResult<string>
    const html = await res.data
    const doi = html.match(/https:\/\/doi.org\/([A-Za-z0-9./]+)/)![1] // Assume
    console.log(`Contacting DOI with ${doi}`)
    // Use custom format URL instead.
    // https://github.com/davidagraf/doi2bib2/blob/master/server/doi2bib.js#L7
    const citationFetch = await fetch(`https://doi.org/${doi}`, {
      headers: {
        'Accept': 'application/x-bibtex; charset=utf-8'
      }
    })
    const bibtex = await citationFetch.text()
    return bibtex // This is already in BibTeX
  }

  // Default impl -- Try reading site directly
  const html = await getDirectHTML(firebase, url)
  const titles = getTitles(html)
  const citation: CitationMisc = {
    id: getId(url),
    author: getAuthors(html),
    title: titles.title,
    publisher: titles.publisher,
    url,
  }
  return citationToBibtex(citation)
}