import { Component, OnInit } from '@angular/core';
import { HttpsCallableResult } from '@firebase/functions';
import { Event } from 'src/app/event';
import { FirebaseService } from 'src/app/firebase.service';

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
    || articleUrl.substring(0, 24) // Default to just the base URL
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
  mainbib = ['main.bib']

  constructor(private firebase: FirebaseService) {}

  ngOnInit(): void {
    window.addEventListener('message', e => {
      const parsedEvent = e.data
      if (parsedEvent?.type === 'rafflesia_getProjectFiles') {
        const files = parsedEvent.data.map((x: any) => x.name)
          .filter((x: string) => x.endsWith('.bib'))
        this.mainbib = files
      }
    })

    this.refreshProjectFiles()
  }

  refreshProjectFiles() {
    const msg: Event = {
      type: 'rafflesia_getProjectFiles',
      data: {},
    }
    window.parent.postMessage(msg, '*')
  }

  /**
   * This function may add special logic when citing specific websites.
   * @param url URL of the document to reference
   */
  async linkCitePreprocessor(url: string) {
    if (url.includes('ieeexplore.ieee.org/document')) {
      const fnc = await this.firebase.getFunction('proxy')
      const res = await fnc({url}) as HttpsCallableResult<string>
      const html = await res.data
      // <a _ngcontent-vov-c185="" append-to-href="?src=document" target="_blank" href="https://doi.org/10.1109/TSG.2021.3124490">10.1109/TSG.2021.3124490</a>
      const doi = html.match(/https:\/\/doi.org\/([A-Za-z0-9./]+)/)![1] // Assume
      console.log(`Contacting DOI with ${doi}`)
      // Use custom format URL instead.
      // Use same impl as in-browser fetch.
      /**
       * @ARTICLE{6598993,  author={},  journal={IEEE Vision for Smart Grid Control: 2030 and Beyond Reference Model},   title={IEEE Vision for Smart Grid Controls: 2030 and Beyond Reference Model},   year={2013},  volume={},  number={},  pages={1-10},  doi={10.1109/IEEESTD.2013.6598993}}
       */
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
    const fnc = await this.firebase.getFunction('proxy')
    const res = await fnc({url}) as HttpsCallableResult<string>
    const html = await res.data
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

  async import() {
    if (!this.articleUrl) return // Nothing
    try {
      const processedCitation = await this.linkCitePreprocessor(this.articleUrl)
      this.bibtex = processedCitation
    } catch (e) {
      const msg: Event = {
        type: 'rafflesia_alert',
        data: {
          title: 'Cannot parse URL',
          body: e
        },
      }
      window.parent.postMessage(msg, '*')
      console.error(e)
    }
  }

  copy() {
    if (!this.bibtex) return // Nothing
    const msg: Event = {
      type: 'rafflesia_copy',
      data: this.bibtex
    }
    window.parent.postMessage(msg, '*')
  }

  openBibtex(filename: string) {
    const msg: Event = {
      type: 'rafflesia_open',
      data: filename,
    }
    window.parent.postMessage(msg, '*')
  }

  newBibtex(filename?: string) {
    if (!filename) {
      filename = prompt('Filename', 'main.bib') ?? 'main.bib'
    }
    const msg: Event = {
      type: 'rafflesia_create',
      data: filename,
    }
    window.parent.postMessage(msg, '*')
  }

  insert() {
    if (!this.bibtex) return // Nothing
    const msg: Event = {
      type: 'rafflesia_insert',
      data: this.bibtex
    }
    window.parent.postMessage(msg, '*')
  }
}
