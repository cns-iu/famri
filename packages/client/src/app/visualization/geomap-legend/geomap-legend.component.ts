import { Component, OnInit } from '@angular/core';

import { GeomapDatabaseService } from '../shared/geomap/geomap-database.service';


@Component({
  selector: 'famri-geomap-legend',
  templateUrl: './geomap-legend.component.html',
  styleUrls: ['./geomap-legend.component.sass']
})
export class GeomapLegendComponent implements OnInit {
  gradient = '';

  constructor(private service: GeomapDatabaseService) { }

  ngOnInit() {
    this.service.fetchData().subscribe(() => {
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
  }
}
