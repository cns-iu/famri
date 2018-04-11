import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { BoundField } from '@ngx-dino/core';

import { Filter, SubdisciplineWeight } from 'famri-database';
import { subdisciplineSizeField, subdisciplineIDField } from '../shared/science-map/science-map-fields';
import { ScienceMapDatabaseService } from '../shared/science-map/science-map-database.service';

@Component({
  selector: 'famri-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass'],
  providers: [ ScienceMapDatabaseService ]
})
export class ScienceMapComponent implements OnInit, OnChanges {
  @Input() filter: Partial<Filter> = {};
  @Output() filterUpdateComplete = new EventEmitter<boolean>();
  @Input() width: number;
  @Input() height: number;

  subdisciplineSize: BoundField<string>;
  subdisciplineID: BoundField<number|string>;
  filteredSubdisciplines: SubdisciplineWeight[];
  
  constructor(private dataService: ScienceMapDatabaseService) { }

  ngOnInit() {
    this.filteredSubdisciplines = [];

    this.dataService.filteredSubdisciplines.subscribe((subdisciplines) => {
      this.filteredSubdisciplines = subdisciplines;
    });

    // not user facing
    this.subdisciplineSize = subdisciplineSizeField.getBoundField('size');
    this.subdisciplineID = subdisciplineIDField.getBoundField('id');
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'filter' && this[propName]) {
        this.dataService.fetchData(this.filter).subscribe(
          undefined, undefined, () => this.filterUpdateComplete.emit(true)
        );
      }
    }
  }
}
