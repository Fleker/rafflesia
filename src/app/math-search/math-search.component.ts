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
    placeholder?: string
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
}, {
  title: 'Multiline Equation',
  tags: ['multiline', 'align', 'lines'],
  latex: "\\begin{align*} x &= $0 \\\\ &= $1 \\\\ &= $2 \\end{align*}",
  params: [{
    label: 'Equation line 1', type: 'text', placeholder: '(5 + 5) * (6 + 6)',
  }, {
    label: 'Equation line 2', type: 'text', placeholder: '10 * 12',
  }, {
    label: 'Equation line 3', type: 'text', placeholder: '120',
  }]
}, {
  title: 'Square Root',
  tags: ['sqrt', 'square', 'root'],
  latex: "\\sqrt{$0}",
  params: [{
    label: 'Number', type: 'number',
  }]
}, {
  title: 'Union',
  tags: ['union', 'cup', 'add', 'set', 'linear'],
  latex: '\\cup',
  params: [],
}, {
  title: 'Intersection',
  tags: ['intersection', 'cap', 'add', 'set', 'linear'],
  latex: '\\cap',
  params: [],
}, {
  title: 'Implies',
  tags: ['implies', 'linear', 'proof'],
  latex: '\\implies',
  params: [],
}, {
  title: 'Subset',
  tags: ['set', 'subset', 'linear'],
  latex: '\\subset',
  params: []
}, {
  title: 'Superset',
  tags: ['set', 'supset', 'superset', 'linear'],
  latex: '\\supset',
  params: []
}, {
  title: 'Item In Set',
  tags: ['set', 'in', 'linear'],
  latex: '\\in',
  params: []
}, {
  title: 'Item Not In Set',
  tags: ['set', 'in', 'not', 'linear'],
  latex: '\\notin',
  params: []
}, {
  title: 'Not Equals',
  tags: ['neq', 'equal', 'not', 'algebra'],
  latex: '\\neq',
  params: []
}, {
  title: 'OPlus',
  tags: ['plus', 'circle', 'set', 'linear'],
  latex: '\\oplus',
  params: []
},]

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
        this.selectionParams[i] = param.placeholder || 'Placeholder'
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
    const html = katex.renderToString(templateStr, {displayMode: true})
    window.requestAnimationFrame(() => {
      this.latexRender!.nativeElement!.innerHTML = html
    })
  }

  exit() {
    this.selection = undefined
  }

  copy() {
    let templateStr = this.selection!.latex
    for (let i = 0; i < this.selectionParams.length; i++) {
      templateStr = templateStr.replace(`$${i}`, this.selectionParams[i])
    }
    const msg: Event = {
      type: 'rafflesia_copy',
      data: templateStr,
    }
    window.parent.postMessage(msg, '*')
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
