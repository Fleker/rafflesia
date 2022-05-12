import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatTabsModule} from '@angular/material/tabs';
import { WikitionaryComponent } from './tools/wikitionary/wikitionary.component';
import { QuiverComponent } from './tools/quiver/quiver.component';
import { TablesComponent } from './tools/tables/tables.component';
import { CitationsComponent } from './tools/citations/citations.component'

@NgModule({
  declarations: [
    AppComponent,
    WikitionaryComponent,
    QuiverComponent,
    TablesComponent,
    CitationsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTabsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
