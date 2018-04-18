import { Component, OnInit } from '@angular/core';

import { StatisticsService } from '../shared/statistics/statistics.service';


@Component({
  selector: 'famri-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.sass']
})
export class StatisticsComponent implements OnInit {
  constructor(private service: StatisticsService) { }

  ngOnInit() {
  }
}
