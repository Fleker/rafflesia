import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/event';

@Component({
  selector: 'tool-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  draft?: string
  chats: {
    line: number
    author: string
    value: string
  }[] = []
  todos: {
    line: number
    value: string
  }[] = []

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
    this.chats = []
    const todoStarts = ['% todo', '% fixme', '% note']
    const chatRegex = new RegExp('% > \\((\\w+)\\) (.*)')
    const lines = this.draft!.split('\n')
    lines.forEach((line, i) => {
      for (const start of todoStarts) {
        const lineIndex = line.toLowerCase().indexOf(start)
        if (lineIndex > -1) {
          this.todos?.push({
            line: i + 1,
            value: line.substr(lineIndex),
          })
        }
      }
      const chatMatch = chatRegex.exec(line)
      if (chatMatch !== null) {
        console.log(chatMatch)
        this.chats?.push({
          line: i + 1,
          author: chatMatch[1],
          value: chatMatch[2],
        })
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
