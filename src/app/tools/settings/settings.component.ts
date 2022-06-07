import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
  }

  updateToolEnabled(event: any, tool: ToolId) {
    updateEnabled(tool, event.checked)
  }
}
