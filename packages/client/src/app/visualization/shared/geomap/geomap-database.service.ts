import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/delay';

import { Changes } from '@ngx-dino/core';
import { DatabaseService, Filter, Grant } from 'famri-database';

@Injectable()
export class GeomapDatabaseService {
  private grantSubscription: Subscription;
  private lastGrants: Grant[] = [];

  filteredGrants = new EventEmitter<Changes<Grant>>();

  constructor(private service: DatabaseService) { }

  fetchData(filter: Partial<Filter> = {}): Observable<Grant[]> {
    if (this.grantSubscription) {
      this.grantSubscription.unsubscribe();
    }

    const grants = this.service.getGrants(filter).delay(1);
    this.grantSubscription = grants.subscribe((g) => {
      const changes = new Changes(g, this.lastGrants);

      this.lastGrants = g;
      this.filteredGrants.emit(changes);
    });

    return grants;
  }
}
