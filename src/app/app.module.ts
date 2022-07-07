import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { OcrPocComponent } from './ocr-poc/ocr-poc.component';

@NgModule({
  declarations: [
    AppComponent,
    OcrPocComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [AppConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
