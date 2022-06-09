import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/event';

@Component({
  selector: 'tool-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  draft?: string
  todos?: {
    line: number
    value: string
  }[]

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
    this.todos = []
    const todoStarts = ['% todo', '% TODO', '% fixme', '% FIXME', '% note', '% NOTE']
    const lines = this.draft!.split('\n')
    lines.forEach((line, i) => {
      for (const start of todoStarts) {
        const lineIndex = line.indexOf(start)
        if (lineIndex > -1) {
          this.todos?.push({
            line: i + 1,
            value: line.substr(lineIndex),
          })
        }
      }
    })
  }

  gotoLine(line: number) {
    const msg: Event = {
      type: 'rafflesia_goto',
      data: line,
    }
    window.parent.postMessage(msg, '*')
  }
}
