import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/event';
import {tools, labels, isEnabled, ToolId, updateEnabled} from '../tool-registry'

@Component({
  selector: 'tool-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  tools = tools
  labels = labels
  isEnabled = isEnabled

  get isDebugMode() {
    return localStorage['rafflesia_iframe'] === 'debug'
  }

  constructor() { }

  ngOnInit(): void {
  }

  updateToolEnabled(event: any, tool: ToolId) {
    updateEnabled(tool, event.checked)
  }

  updateDebugMode(event: any) {
    const env = (() => {
      if (event.checked) return 'debug'
      return 'prod'
    })()
    localStorage['rafflesia_iframe'] = env
    const msg: Event = {
      type: 'rafflesia_iframe',
      data: env,
    }
    window.parent.postMessage(msg, '*')
  }
}
