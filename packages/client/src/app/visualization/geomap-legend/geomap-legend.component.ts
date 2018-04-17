import {
  Component, Input,
  OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';

import { BoundField } from '@ngx-dino/core';
import { Filter } from 'famri-database';

import { GeomapDatabaseService } from '../shared/geomap/geomap-database.service';
import { pointSizeField } from '../shared/geomap/geomap-fields';


@Component({
  selector: 'famri-geomap-legend',
  templateUrl: './geomap-legend.component.html',
  styleUrls: ['./geomap-legend.component.sass']
})
export class GeomapLegendComponent implements OnInit, OnChanges {
  @Input() filter: Partial<Filter> = {};

  gradient = '';
  medianCount: number;
  maxCount: number;

  sizeField: BoundField<number>;
  sizeValues: {weight: number}[];

  constructor(private service: GeomapDatabaseService) {
    this.sizeField = pointSizeField.getBoundField('fixed');
  }

  ngOnInit() {
    this.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('filter' in changes) {
      this.update();
    }
  }

  private update() {
    this.service.fetchData(this.filter).subscribe(() => {
      const colors: string[] = [];
      for (let i = 0; i <= this.service.maxCountRef.max; ++i) {
        const color = this.service.gradient(i);
        const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/g.exec(color);
        const hexColor = '#' + match.slice(1)
          .map((c) => Number(c).toString(16))
          .map((c) => c.length === 2 ? c : '0' + c).join('');

        colors.push(hexColor);
      }

      this.gradient = `linear-gradient(to bottom, ${colors.join(', ')})`;
    });

    this.service.countsByState.subscribe(() => {
      this.maxCount = this.service.maxCountRef.max;
      this.medianCount = Math.floor(this.maxCount / 2);
    });

    this.service.filteredGrants.subscribe((grants) => {
      this.sizeValues = grants.add.map(this.sizeField.operator.getter)
        .map((weight) => ({weight}));
    });
  }
}
