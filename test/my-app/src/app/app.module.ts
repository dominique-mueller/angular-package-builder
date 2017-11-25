import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LIBModule } from 'my-library';

import { AppComponent } from './app.component';

/**
 * App Module
 */
@NgModule( {
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LIBModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
} )
export class AppModule {}
