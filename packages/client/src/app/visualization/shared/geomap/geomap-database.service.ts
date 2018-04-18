import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { interpolateOrRd as rawGradient } from 'd3-scale-chromatic';

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

    initialOp: Operator.access('publications.length'),
    mapping: {
      fixed: Operator.constant(30),
      npub_area: Operator.map(this.size.bind(this)),
      npub_rad: true
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
    let max = 1;

    grants.forEach((g) => {
      max = Math.max(max, g.publications.length);
    });

    const changes = new Changes(grants, this.lastGrants);
    this.lastGrants = grants;
    this.maxPubCountRef.max = max;
    this.filteredGrants.emit(changes);
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
