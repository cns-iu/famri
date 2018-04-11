import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/of';

import { Filter } from '../shared/filter';
import { Publication } from '../shared/publication';
import { Author, CoAuthorEdge } from '../shared/author';
import { Grant } from '../shared/grant';

import { SubdisciplineWeight } from '../shared/subdiscipline-weight';

import * as database from '../../../../raw-data/database.json';

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

const grants: Grant[] = database.grants;
const publications: Publication[] = database.publications;
const authors: Author[] = [];
const coauthors: CoAuthorEdge[] = [];

@Injectable()
export class DatabaseService {
  constructor() { }

  getAuthors(filter: Partial<Filter> = {}): Observable<Author[]> {
    return Observable.of(authors);
  }
  getCoAuthorEdges(filter: Partial<Filter> = {}): Observable<CoAuthorEdge[]> {
    return Observable.of(coauthors);
  }
  getGrants(filter: Partial<Filter> = {}): Observable<Grant[]> {
    return Observable.of(grants);
  }
  getPublications(filter: Partial<Filter> = {}): Observable<Publication[]> {
    return Observable.of(publications);
  }

  getSubdisciplines(filter: Partial<Filter> = {}): Observable<SubdisciplineWeight[]> {
    return this.getPublications(filter).map((publications) => {
      const weights = sumAgg<Publication>(publications, 'subdisciplines', 'subd_id', 'weight');
      return Object.entries(weights).map(([k, v]) => <SubdisciplineWeight>{subd_id: <number>(<any>k), weight: v});
    });
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
