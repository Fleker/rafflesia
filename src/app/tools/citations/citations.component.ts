import { Component, OnInit } from '@angular/core';
import { HttpsCallableResult } from '@firebase/functions';
import { Event } from 'src/app/event';
import { FirebaseService } from 'src/app/firebase.service';
import * as C from 'src/app/citations'
import { getExternalLink, parseBibtexFile } from 'src/app/bibtex';

@Component({
  selector: 'tool-citations',
  templateUrl: './citations.component.html',
  styleUrls: ['./citations.component.css']
})
export class CitationsComponent implements OnInit {
  articleUrl?: string
  bibtex?: string
  draft?: string
  mainbib = ['main.bib']
  citations: {
    url?: string
    title: string
  }[] = []

  constructor(private firebase: FirebaseService) {}

  ngOnInit(): void {
    window.addEventListener('message', e => {
      const parsedEvent = e.data
      if (parsedEvent?.type === 'rafflesia_getProjectFiles') {
        const files = parsedEvent.data.map((x: any) => x.name)
          .filter((x: string) => x.endsWith('.bib'))
        this.mainbib = files
      }

      if (parsedEvent?.type === 'rafflesia_read') {
        this.draft = parsedEvent.data
        this.parse()
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

  refreshDocContents() {
    const msg: Event = {
      type: 'rafflesia_read',
      data: {},
    }
    window.parent.postMessage(msg, '*')
  }

  async import() {
    if (!this.articleUrl) return // Nothing
    try {
      const processedCitation = await C.linkCitePreprocessor(this.firebase, fetch, this.articleUrl)
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

  parse() {
    const bibtexs = parseBibtexFile(this.draft ?? '')
    console.log(bibtexs)
    this.citations = bibtexs.map(bibtex => ({
      title: bibtex.title ?? bibtex.id,
      url: getExternalLink(bibtex)
    }))
    console.log(this.citations)
  }
}
