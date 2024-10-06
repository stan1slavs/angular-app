import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [BrowserModule, HttpClientModule, CommonModule, AppComponent],
  providers: [],
})
export class AppModule {}
