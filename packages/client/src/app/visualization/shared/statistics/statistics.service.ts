import { Injectable, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { Map, Set } from 'immutable';

import {
  DatabaseService, Filter,
  Author, CoAuthorEdge, Grant, Publication
} from 'famri-database';

import { Statistics } from './statistics';


type DataTuple = [Author[], CoAuthorEdge[], Grant[], Publication[]];

@Injectable()
export class StatisticsService {
  private subscriptions: Subscription[] = [];

  readonly statistics = new EventEmitter<Statistics>();

  constructor(private service: DatabaseService) { }

  fetchData(filter: Partial<Filter> = {}): void {
    this.clearSubscriptions();

    const dataObservables = [];
    dataObservables.push(this.service.getAuthors(filter));
    dataObservables.push(this.service.getCoAuthorEdges(filter));
    dataObservables.push(this.service.getGrants(filter));
    dataObservables.push(this.service.getPublications(filter));

    this.subscriptions.push(Observable.combineLatest(dataObservables)
      .subscribe((data: DataTuple) => {
        this.statistics.emit(this.collectStatistics(data));
      }));
  }

  private clearSubscriptions(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  private collectStatistics(
    [authors, coauthorsEdges, grants, publications]: DataTuple
  ): Statistics {
    const result = {} as Statistics;

    result.nPublications = publications.length;
    result.nAuthors = authors.length;
    result.nGrants = grants.length;

    result.avgAuthorsPerPublication = publications.reduce((sum, pub) => {
      return sum + pub.authors.length;
    }, 0) / publications.length;

    // nAuthorsByYear
    const authorsByYear = Map<number, Set<string>>().withMutations((map) => {
      publications.forEach((pub) => {
        map.updateIn([pub.year], (set: Set<String> = Set()) => {
          return set.union(pub.authors);
        });
      });
    });

    result.nAuthorsByYear = authorsByYear.entrySeq().map(([year, set]) => {
      return {year, count: set.size};
    }).toArray().sort((a, b) => a.year - b.year);

    // TODO
    return result;
  }
}
