import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';

import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,

    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTabsModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [HomeComponent]
})
export class FamriUiModule { }
