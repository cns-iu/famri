import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BoundField } from '@ngx-dino/core';

import { Filter, SubdisciplineWeight } from 'famri-database';
import { subdisciplineSizeField, subdisciplineIDField } from '../shared/science-map/science-map-fields';
import { ScienceMapDatabaseService } from '../shared/science-map/science-map-database.service';

@Component({
  selector: 'famri-science-map',
  templateUrl: './science-map.component.html',
  styleUrls: ['./science-map.component.sass']
})
export class ScienceMapComponent implements OnInit {
  @Input() filter: Partial<Filter> = {};
  @Output() filterUpdateComplete = new EventEmitter<boolean>();
  @Output() nodeClicked = new EventEmitter<any>();
  @Input() width: number;
  @Input() height: number;

  subdisciplineSize: BoundField<string>;
  subdisciplineID: BoundField<number|string>;
  filteredSubdisciplines: Observable<SubdisciplineWeight[]>;

  constructor(private dataService: ScienceMapDatabaseService) {
    this.filteredSubdisciplines = this.dataService.filteredSubdisciplines.asObservable();
  }

  ngOnInit() {
    // not user facing
    this.subdisciplineSize = subdisciplineSizeField.getBoundField('size');
    this.subdisciplineID = subdisciplineIDField.getBoundField('id');
  }
}
