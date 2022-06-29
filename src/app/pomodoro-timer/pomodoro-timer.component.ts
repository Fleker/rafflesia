import { Component, OnInit } from '@angular/core';
import { Event } from '../event';

@Component({
  selector: 'tool-pomodoro',
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.css']
})
export class PomodoroTimerComponent implements OnInit {
  isActive = false
  minutes = 15
  seconds = 15 * 60
  interval: any = undefined

  get icon() {
    return this.isActive ? 'pause' : 'play_arrow'
  }

  get renderString() {
    const min = Math.floor(this.seconds / 60)
    const seconds = this.seconds - min * 60
    return `${min}:${seconds.toString().padStart(2, '0')}`
  }

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    if (this.isActive) {
      // Stop
      clearInterval(this.interval) 
    } else {
      // Start
      this.interval = setInterval(() => {
        this.seconds--
        if (this.seconds === 0) {
          // Alert the user!
          const body = (() => {
            if (this.minutes === 1) return 'minute has'
            return 'minutes have'
          })()
          const msg: Event = {
            type: 'rafflesia_alert',
            data: {
              title: 'Your timer is up!',
              body: `${this.minutes} ${body} passed.`
            },
          }
          window.parent.postMessage(msg, '*')
          this.toggle() // Stop
        }
      }, 1000)
    }
    this.isActive = !this.isActive
  }

  reset() {
    this.seconds = this.minutes * 60
  }
}
