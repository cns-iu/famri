import {
  Component, Input,
  OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';

import { Filter } from 'famri-database';

import { Statistics } from '../shared/statistics/statistics';
import { AuthorsByYearFields } from '../shared/statistics/statistics-fields';
import { StatisticsService } from '../shared/statistics/statistics.service';


@Component({
  selector: 'famri-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.sass']
})
export class StatisticsComponent implements OnInit, OnChanges {
  @Input() filter: Partial<Filter> = {};

  statistics: Statistics = {} as Statistics;

  nAuthorsByYearFields = [
    AuthorsByYearFields.yearField.getBoundField('default'),
    AuthorsByYearFields.authorCountField.getBoundField('default')
  ];

  constructor(private service: StatisticsService) {
    service.statistics.subscribe((s) => (this.statistics = s));
  }

  ngOnInit() {
    this.service.fetchData(this.filter);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('filter' in changes) {
      this.service.fetchData(this.filter);
    }
  }
}
