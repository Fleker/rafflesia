import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon'
import { WikitionaryComponent } from './tools/wikitionary/wikitionary.component';
import { QuiverComponent } from './tools/quiver/quiver.component';
import { TablesComponent } from './tools/tables/tables.component';
import { CitationsComponent } from './tools/citations/citations.component';
import { SettingsComponent } from './tools/settings/settings.component';
import { CommentsComponent } from './tools/comments/comments.component';
import { WordCounterComponent } from './tools/word-counter/word-counter.component'

@NgModule({
  declarations: [
    AppComponent,
    WikitionaryComponent,
    QuiverComponent,
    TablesComponent,
    CitationsComponent,
    SettingsComponent,
    CommentsComponent,
    WordCounterComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTabsModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
