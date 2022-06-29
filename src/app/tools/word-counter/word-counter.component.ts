import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/event';

const COMMON = [
  'the', 'that', 'is', 'and', 'of', 'be', 'can', 'as', 'a', 'in', 'then', 'an',
  'this', 'i', 'we', 'us', 'you', 'he', 'she', 'they', 'to',
]

@Component({
  selector: 'tool-wordcloud',
  templateUrl: './word-counter.component.html',
  styleUrls: ['./word-counter.component.css']
})
export class WordCounterComponent implements OnInit {
  draft?: string
  counter = {
    characters: 0,
    words: 0,
    paragraphs: 0,
  }
  frequency = {
    most: [['', 0]],
    least: [['', 0]],
  }

  constructor() { }

  ngOnInit(): void {
    window.addEventListener('message', e => {
      const parsedEvent = e.data
      if (parsedEvent?.type === 'rafflesia_read') {
        this.draft = parsedEvent.data
        this.parseDocContents()
      }
    })

    this.refreshDocContents()
  }

  refreshDocContents() {
    const msg: Event = {
      type: 'rafflesia_read',
      data: {},
    }
    window.parent.postMessage(msg, '*')
  }

  parseDocContents() {
    if (!this.draft) {
      return
    }
    // TODO: Improve algorithm by filtering out non-words
    this.counter.characters = this.draft.length
    this.counter.paragraphs = this.draft.split('\n\n').length

    const frequency = new Map()
    const words = this.draft.split(' ')
      .filter(word => !word.startsWith('\\')) // No commands
      .filter(word => !word.startsWith('http')) // No URLs
      .filter(word => !!word.match('[A-Za-z]')) // Must be a word
      .filter(word => !word.includes('%'))
      .filter(word => !word.includes('='))
      .filter(word => !word.includes('}'))
      .filter(word => !word.includes('$'))
      .filter(word => !word.includes(')'))
      .filter(word => !word.includes('('))
      .filter(word => !word.includes('\\'))
      .map(x => x.replace(/[,.!?]/g, '')) // Remove punctuation
      .map(x => x.toLowerCase())
    // TODO: Improve by filtering out non-words
    this.counter.words = words.length
    words.forEach(word => {
      if (COMMON.includes(word)) return
      if (frequency.has(word)) {
        return frequency.set(word, frequency.get(word) + 1)
      }
      return frequency.set(word, 1)
    })
    // Sort
    const freqArr = [...frequency].sort((lhs, rhs) => rhs[1] - lhs[1])
    this.frequency.most = freqArr.slice(0, 5)
    this.frequency.least = freqArr.slice(freqArr.length - 5, freqArr.length)
  }
}
