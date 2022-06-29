import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// const katex = require('katex');
import katex from 'katex';
import { Event } from '../event';


interface MathTopicEntry {
  title: string
  tags: string[]
  latex: string
  params: {
    label: string
    type: 'number' | 'text'
  }[]
}

const CATALOG: MathTopicEntry[] = [{
  title: 'Fractions',
  tags: ['frac', 'fraction'],
  latex: "\\frac{$0}{$1}",
  params: [{
    label: 'Numerator', type: 'number',
  }, {
    label: 'Denominator', type: 'number',
  }]
}]

@Component({
  selector: 'tool-maths',
  templateUrl: './math-search.component.html',
  styleUrls: ['./math-search.component.css']
})
export class MathSearchComponent implements OnInit {
  @ViewChild('latexrender') latexRender?: ElementRef<HTMLDivElement>
  results: MathTopicEntry[] = []
  selection?: MathTopicEntry
  selectionParams: any[] = []

  constructor() { }

  ngOnInit(): void {
  }

  search(event: any) {
    const term = event.path[0].value
    this.results = CATALOG.filter(entry => entry.tags.includes(term))
  }

  showResult(r: MathTopicEntry) {
    this.selection = r
    this.selectionParams = new Array(r.params.length)
    this.selection.params.forEach((param, i) => {
      if (param.type === 'number') {
        this.selectionParams[i] = Math.floor(Math.random() * 10)
      } else if (param.type === 'text') {
        this.selectionParams[i] = 'Placeholder'
      }
    })
    this.rerenderTemplate()
  }

  rerenderTemplate() {
    let templateStr = this.selection!.latex
    for (let i = 0; i < this.selectionParams.length; i++) {
      templateStr = templateStr.replace(`$${i}`, this.selectionParams[i])
    }
    console.log(this.selection!.latex, this.selectionParams, templateStr)
    const html = katex.renderToString(templateStr)
    window.requestAnimationFrame(() => {
      this.latexRender!.nativeElement!.innerHTML = html
    })
  }

  exit() {
    this.selection = undefined
  }

  insert() {
    let templateStr = this.selection!.latex
    for (let i = 0; i < this.selectionParams.length; i++) {
      templateStr = templateStr.replace(`$${i}`, this.selectionParams[i])
    }
    const msg: Event = {
      type: 'rafflesia_insert',
      data: templateStr,
    }
    window.parent.postMessage(msg, '*')
  }
}
