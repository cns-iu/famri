import {
  Component, Input, Output,
  OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { BoundField, BoundFieldAdapter, adaptBoundField } from '@ngx-dino/core';
import { Filter } from 'famri-database';

import { GeomapDatabaseService } from '../shared/geomap/geomap-database.service';
import * as Fields from '../shared/geomap/geomap-fields';


@Component({
  selector: 'famri-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.sass'],
  providers: [GeomapDatabaseService]
})
export class GeomapComponent implements OnInit, OnChanges {
  stateData = Observable.of();
  stateField: BoundField<string>;
  stateColorField: BoundField<string>;

  pointData: Observable<any>;
  pointIdField: BoundField<string>;
  pointPositionField: BoundField<[number, number]>;
  pointShapeField: BoundField<string>;
  pointSizeField: BoundField<number>;
  pointColorField: BoundField<string>;
  pointStrokeColorField: BoundField<string>;

  adapters = [];

  @Input() filter: Partial<Filter> = {};

  constructor(private service: GeomapDatabaseService) { }

  ngOnInit() {
    this.stateField = Fields.stateField.getBoundField('default');
    this.stateColorField = Fields.stateColorField.getBoundField('default');

    this.pointData = this.service.filteredGrants;
    this.pointIdField = Fields.pointIdField.getBoundField('gid');
    this.pointPositionField = Fields.pointPositionField.getBoundField('current');
    this.pointShapeField = Fields.pointShapeField.getBoundField('circle');
    this.pointSizeField = Fields.pointSizeField.getBoundField('fixed');
    this.pointColorField = Fields.pointColorField.getBoundField('fixed');
    this.pointStrokeColorField = Fields.pointStrokeColorField.getBoundField('fixed');

    this.adapters.push(
      this.stateField,
      this.stateColorField,

      this.pointIdField,
      this.pointPositionField,
      this.pointShapeField,
      this.pointSizeField,
      this.pointColorField,
      this.pointStrokeColorField
    );

    this.service.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('filter' in changes) {
      this.service.fetchData(this.filter);
    }
  }
}
