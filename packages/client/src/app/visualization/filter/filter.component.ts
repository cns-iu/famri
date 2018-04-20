import {
  Component, Output,
  OnInit,
  ViewEncapsulation, EventEmitter
} from '@angular/core';

import { assign, clone, debounce } from 'lodash';

import { Filter } from 'famri-database';


@Component({
  selector: 'famri-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {
  private filter: Partial<Filter> = {year: {start: 2002, end: 2017}};
  @Output() filterChange = new EventEmitter<Partial<Filter>>();

  yearSliderConfig = {
    start: [2002, 2017],
    margin: 0,
    padding: [0, 0],
    step: 1,
    range: {
      min: [2002],
      max: [2017]
    },
    connect: [false, true, false],
    tooltips: [true, true],
    format: {
      to: Number,
      from: Number
    }
  };

  constructor() { }

  ngOnInit() {
  }

  onYearChange([start, end]: [number, number]): void {
    this.updateFilter({year: {start, end}});
  }

  private updateFilter(change: Partial<Filter>): void {
    assign(this.filter, change);
    this.filterChange.emit(clone(this.filter));
  }
}
