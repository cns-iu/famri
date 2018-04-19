import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BoundField } from '@ngx-dino/core';
import { Filter, SubdisciplineWeight } from 'famri-database';

import { subdisciplineSizeField } from '../shared/science-map/science-map-fields';
import { ScienceMapDatabaseService } from '../shared/science-map/science-map-database.service';

@Component({
  selector: 'famri-science-map-legend',
  templateUrl: './science-map-legend.component.html',
  styleUrls: ['./science-map-legend.component.sass']
})
export class ScienceMapLegendComponent implements OnInit, OnChanges {
  @Input() filter: Partial<Filter> = {};
  @Output() filterUpdateComplete = new EventEmitter<boolean>();

  subdisciplineSize: BoundField<string>;
  filteredSubdisciplines: Observable<SubdisciplineWeight[]>;
  unmappedSubdisciplines: Observable<SubdisciplineWeight>;

  nodeSizeEncoding = '# Fractionally Assigned Papers';

  constructor(private dataService: ScienceMapDatabaseService) {
    this.filteredSubdisciplines = dataService.filteredSubdisciplines.asObservable();
    this.unmappedSubdisciplines = dataService.unmappedSubdisciplines.asObservable();
  }

  ngOnInit() {
    this.subdisciplineSize = subdisciplineSizeField.getBoundField('size');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (('filter' in changes) && this.filter) {
      this.dataService.fetchData(this.filter).subscribe(undefined, undefined,
        () => this.filterUpdateComplete.emit(true)
      );
    }
  }
}
