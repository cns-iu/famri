import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Map, Record } from 'immutable';

import { interpolateOrRd as rawGradient } from 'd3-scale-chromatic';

import { Operator, FieldV2 as Field, Changes } from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/access';
import '@ngx-dino/core/src/operators/add/static/constant';
import '@ngx-dino/core/src/operators/add/static/map';

import { DatabaseService, Filter, Grant } from 'famri-database';


export const LocationRecord = Record({latitude: Infinity, longitude: Infinity});
export interface AggregatedGrant {
  id: string;
  location: typeof LocationRecord;
  count: number;
}


@Injectable()
export class GeomapDatabaseService {
  private grantSubscription: Subscription;
  private lastCounts: any[] = [];
  private lastGrants: AggregatedGrant[] = [];

  readonly maxCountRef = {max: 1};
  readonly stateColorField = new Field<string>({
    id: 'scolor',
    label: 'State Color',

    initialOp: Operator.access('count'),
    mapping: {
      default: Operator.constant(undefined),
      gradient: Operator.map(this.gradient.bind(this))
    }
  });

  readonly locationState = new Field<string>({
    id: 'lstate',
    label: 'Location State',

    initialOp: Operator.access('institution.enteredLocation.state'),
    mapping: {default: true}
  });

  readonly maxPubCountRef = {max: 1};
  readonly pointSizeField = new Field<number>({
    id: 'psize',
    label: 'Point Size',

    initialOp: Operator.access('count'),
    mapping: {
      fixed: Operator.constant(30),
      npub_area: Operator.map(this.size.bind(this)),
      npub_rad: true
    }
  });

  readonly countsByState = new EventEmitter<Changes<{state: string, count: number}>>();
  readonly filteredGrants = new EventEmitter<Changes<AggregatedGrant>>();
  readonly grantsNoLocation = new EventEmitter<number>();

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
    let noLocationCount = 0;
    const aggrGrants = Map<typeof LocationRecord, AggregatedGrant>()
      .withMutations((map) => {
        grants.forEach((g) => {
          const location: any = LocationRecord(g.pi.location);
          if (location.latitude === Infinity || location.longitude === Infinity) {
            noLocationCount++;
          }

          map.updateIn([location], (ag: AggregatedGrant) => {
            if (ag === undefined) {
              return {id: g.id, location, count: g.publications.length};
            }

            ag.count += g.publications.length;
            return ag;
          });
        });
      }).valueSeq().toArray();

    let max = 1;
    aggrGrants.forEach((g) => {
      max = Math.max(max, g.count);
    });
    this.maxPubCountRef.max = max;

    const changes = new Changes(aggrGrants, this.lastGrants);
    this.lastGrants = aggrGrants;
    this.filteredGrants.emit(changes);
    this.grantsNoLocation.emit(noLocationCount);
  }

  private processStateData(grants: Grant[]): void {
    const field = this.locationState.getBoundField('default');
    const acc: {[state: string]: number} = {};
    const result = [];
    let max = 0;

    for (const g of grants) {
      const state = field.get(g);
      if (state !== undefined) {
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

  gradient(value: number): string {
    return rawGradient(.75 * value / this.maxCountRef.max + .25);
  }

  size(value: number): number {
    return 500 * value / this.maxPubCountRef.max + 30;
  }
}
