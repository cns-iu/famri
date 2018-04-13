import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { interpolateOrRd as gradient } from 'd3-scale-chromatic';

import { Operator, FieldV2 as Field, Changes } from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/access';
import '@ngx-dino/core/src/operators/add/static/constant';
import '@ngx-dino/core/src/operators/add/static/map';

import { DatabaseService, Filter, Grant } from 'famri-database';


@Injectable()
export class GeomapDatabaseService {
  private grantSubscription: Subscription;
  private lastCounts: any[] = [];
  private lastGrants: Grant[] = [];
  private readonly maxCountRef = {max: 0};

  readonly stateColorField = new Field<string>({
    id: 'scolor',
    label: 'State Color',

    initialOp: Operator.access('count'),
    mapping: {
      default: Operator.constant(undefined),
      gradient: Operator.map((count) => {
        return gradient(.75 * count / this.maxCountRef.max + .25);
      })
    }
  });

  readonly countsByState = new EventEmitter<Changes<{state: string, count: number}>>();
  readonly filteredGrants = new EventEmitter<Changes<Grant>>();

  constructor(private service: DatabaseService) { }

  fetchData(filter: Partial<Filter> = {}): Observable<Grant[]> {
    if (this.grantSubscription) {
      this.grantSubscription.unsubscribe();
    }

    const grants = this.service.getGrants(filter);
    this.grantSubscription = grants.subscribe((g) => {
      this.processPointData(g);
      this.processStateData(g);
    });

    return grants;
  }

  private processPointData(grants: Grant[]): void {
    const changes = new Changes(grants, this.lastGrants);

    this.lastGrants = grants;
    this.filteredGrants.emit(changes);
  }

  private processStateData(grants: Grant[]): void {
    const acc: {[state: string]: number} = {};
    const result = [];
    let max = 0;

    for (const g of grants) {
      if (g.currentLocation) {
        const state = g.currentLocation.state;
        acc[state] = (acc[state] || 0) + 1;
      }
    }

    for (const [state, count] of Object.entries(acc)) {
      result.push({state, count});
      max = Math.max(max, count);
    }

    const changes = new Changes(result, this.lastCounts);
    this.lastCounts = result;
    this.maxCountRef.max = max;
    this.countsByState.emit(changes);
  }
}
