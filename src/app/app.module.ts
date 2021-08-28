import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import "bootstrap";
import { Part1Component } from './part1/part1.component';
import { Part2Component } from './part2/part2.component';

@NgModule({
  declarations: [
    AppComponent,
    Part1Component,
    Part2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
