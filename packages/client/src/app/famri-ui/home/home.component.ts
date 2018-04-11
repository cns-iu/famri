import { Component, OnInit } from '@angular/core';

import { Filter } from 'famri-database';

@Component({
  selector: 'famri-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  filter: Partial<Filter> = {};
  filtersUpdating = false;
  openState = true;

  narrowWidth = window.innerWidth - 340;
  wideWidth = window.innerWidth;
  height = window.innerHeight - 110;

  constructor() { }

  ngOnInit() {
  }

}
