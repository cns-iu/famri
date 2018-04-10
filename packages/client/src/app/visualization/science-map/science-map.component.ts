import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'famri-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass']
})
export class ScienceMapComponent implements OnInit {
  width = window.innerWidth - 200;
  height = window.innerHeight - 100;
  constructor() { }

  ngOnInit() {
  }

}
