import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core';
import { FamriUiModule } from './famri-ui';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    FamriUiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
