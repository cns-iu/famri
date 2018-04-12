import { Component, OnInit } from '@angular/core';

import { adaptBoundField } from '@ngx-dino/core';
import { DatabaseService } from 'famri-database';


@Component({
  selector: 'famri-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.sass']
})
export class GeomapComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }
}
