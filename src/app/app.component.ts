import { Component } from '@angular/core';
import { labels, ToolId } from './tools/tool-registry';

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
    wiktionary: true,
    quiver: true,
    tables: true,
    citations: true,
  }
}
