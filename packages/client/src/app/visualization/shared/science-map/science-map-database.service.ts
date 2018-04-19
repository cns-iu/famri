import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DatabaseService, Filter, SubdisciplineWeight } from 'famri-database';


@Injectable()
export class ScienceMapDatabaseService {

  private dataSubscription: Subscription;
  filteredSubdisciplines = new BehaviorSubject<SubdisciplineWeight[]>([]);
  unmappedSubdisciplines = new BehaviorSubject<SubdisciplineWeight>({subd_id: -1, weight: 0});

  constructor(private databaseService: DatabaseService) { }

  fetchData(filter: Partial<Filter> = {}) {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    const subdiscs = this.databaseService.getSubdisciplines(filter).map((subdisciplines) => {
      const unmappedSubdisciplines = {subd_id: -1, weight: 0};
      subdisciplines = subdisciplines.filter((s) => {
        if (s.subd_id == -1) {
          unmappedSubdisciplines.weight = s.weight;
        }
        return s.subd_id != -1;
      });
      this.unmappedSubdisciplines.next(unmappedSubdisciplines);
      return subdisciplines;
    });
    subdiscs.subscribe((s) => {
      this.filteredSubdisciplines.next(s);
    });

    return subdiscs;
  }
}
