import {
  Component, ViewChild,
  OnInit
} from '@angular/core';
import { MatTabGroup } from '@angular/material';

import { Filter } from 'famri-database';

@Component({
  selector: 'famri-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  @ViewChild('tabs') tabs: MatTabGroup;
  tabIndex: number = 0;

  filter: Partial<Filter> = {};
  filtersUpdating = false;
  openState = true;

  narrowWidth = window.innerWidth - 340;
  wideWidth = window.innerWidth;
  height = window.innerHeight - 130;

  constructor() { }

  ngOnInit() {
    this.tabs.selectedIndexChange.subscribe((index) => (this.tabIndex = index));
  }
}
