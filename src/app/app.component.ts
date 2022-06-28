import { Component } from '@angular/core';
import { isEnabled, labels, ToolId } from './tools/tool-registry';

type ToolSettings = Record<ToolId, boolean>

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rafflesia';
  labels = labels;
  tools: ToolSettings = {
    // wiktionary: false,
    // quiver: true,
    // tables: true,
    citations: true,
    comments: true,
    wordcloud: true,
    settings: true,
  }

  hasTool(tool: ToolId) {
    return isEnabled(tool)
  }
}
