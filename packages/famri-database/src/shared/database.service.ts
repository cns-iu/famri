import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { Filter } from '../shared/filter';
import { Publication } from '../shared/publication';
import { Author, CoAuthorEdge } from '../shared/author';
import { Grant } from '../shared/grant';

import { SubdisciplineWeight } from '../shared/subdiscipline-weight';
import { database } from './database';

function sumAgg<T>(items: T[], itemKeyField: string, keyField: string, valueField: string): Promise<{[key: string]: number}> {
  const acc: any = {};
  for (const innerItem of items) {
    for (const item of innerItem[itemKeyField]) {
      const key = item[keyField];
      const weight = item[valueField];
      if (acc.hasOwnProperty(key)) {
        acc[key] += weight;
      } else {
        acc[key] = weight;
      }
    }
  }
  return acc;
}

@Injectable()
export class DatabaseService {
  private db = database;

  constructor() { }

  getAuthors(filter: Partial<Filter> = {}): Observable<Author[]> {
    return Observable.of(this.db.authors).map((authors) => {
      return !filter.year ? authors : this.filterCoAuthors(filter);
    }).delay(1);
  }
  private filterCoAuthors(filter: Partial<Filter> = {}): Author[] {
    const years = [];
    for (let yr = filter.year.start; yr <= filter.year.end; yr++) {
      years.push(yr);
    }
    const filtered = this.db.authors.filter((a) => {
      return years.filter((y) => a.paperCountsByYear[y]).length > 0;
    });
    return filtered.slice(0, 10);
  }

  getCoAuthorEdges(filter: Partial<Filter> = {}): Observable<CoAuthorEdge[]> {
    return Observable.of(this.db.coauthorEdges).map((edges) => {
      if (!filter.year) {
        return edges;
      } else {
        const authors = this.filterCoAuthors(filter);
        return this.db.coauthorNetwork.getEdges(authors);
      }
    }).delay(1);
  }

  getGrants(filter: Partial<Filter> = {}): Observable<Grant[]> {
    return Observable.of(this.db.grants).map((grants) => {
      return !filter.year ? grants : grants.filter((g) => {
        return filter.year.start <= g.year && g.year <= filter.year.end;
      });
    }).delay(1);
  }

  getPublications(filter: Partial<Filter> = {}): Observable<Publication[]> {
    if(filter.year) {
      const filteredPublications = this.db.publications.filter((pubs: any) => {
        return (pubs.year >= filter.year.start && pubs.year <= filter.year.end)? pubs: null;
      });
      return Observable.of(filteredPublications);
    } else {
      return Observable.of(this.db.publications);
    }
  }

  getSubdisciplines(filter: Partial<Filter> = {}): Observable<SubdisciplineWeight[]> {
    return this.getPublications(filter).map((publications) => {
      const weights = sumAgg<Publication>(publications, 'subdisciplines', 'subd_id', 'weight');
      return Object.entries(weights).map(([k, v]) => <SubdisciplineWeight>{subd_id: <number>(<any>k), weight: v});
    }).delay(1);
  }

  getDistinct(fieldName: string, filter: Partial<Filter> = {}): Observable<string[]> {
    return this.getPublications(filter).map((publications) => {
      const seen: any = {};
      const values: string[] = [];
      for (const pub of publications) {
        const value = pub[fieldName];
        if (!seen.hasOwnProperty(value)) {
          seen[value] = true;
          values.push(value);
        }
      }
      return values;
    });
  }
}
