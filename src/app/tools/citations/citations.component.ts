import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/event';

interface CitationMisc {
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

function getId(articleUrl: string) {
  const arr = articleUrl.split('/')
  const lastPath = arr[arr.length - 1]
  return lastPath.substring(0, 24) // Have some upperbound to size
}

function getTitles(html: string) {
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

function getAuthors(html: string) {
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

function authorsToBibtex(citation: CitationMisc) {
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

function citationToBibtex(citation: CitationMisc) {
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

@Component({
  selector: 'tool-citations',
  templateUrl: './citations.component.html',
  styleUrls: ['./citations.component.css']
})
export class CitationsComponent implements OnInit {
  articleUrl?: string
  bibtex?: string

  constructor() {}

  ngOnInit(): void {
  }

  async import() {
    if (!this.articleUrl) return // Nothing
    try {
      const res = await fetch(`https://cors-anywhere.herokuapp.com/${this.articleUrl.trim()}`)
      const html = await res.text()
      // console.log(res)
      // console.log(html)
      const titles = getTitles(html)
      const citation: CitationMisc = {
        id: getId(this.articleUrl),
        author: getAuthors(html),
        title: titles.title,
        publisher: titles.publisher,
        url: this.articleUrl,
      }
      this.bibtex = citationToBibtex(citation)
    } catch (e) {
      console.error(e)
    }
  }

  copy() {
    if (!this.bibtex) return // Nothing
    const msg: Event = {
      type: 'rafflesia_copy',
      data: this.bibtex
    }
    window.parent.postMessage(JSON.stringify(msg), '*')
  }
}
