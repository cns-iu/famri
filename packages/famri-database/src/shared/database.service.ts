import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Map, Set } from 'immutable';

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
  db = database;

  constructor() { }

  getAuthors(filter: Partial<Filter> = {}): Observable<Author[]> {
    const fullAuthors = Map<string, Author>().asMutable();
    const coAuthors = Map<Author, Set<string>>().asMutable();
    const filteredByYear = this.db.publications.filter(
      (pubs) => pubs.year > filter.year.start && pubs.year < filter.year.end
    );

    filteredByYear.forEach(element => {
      element.authors.forEach(author => {
        fullAuthors.update(author, (a = {
         name: author,
         paperCount: 0,
         coauthorCount: 0,
         paperCountsByYear: undefined,
         coauthorCountsByYear: undefined
       }) => {
         ++a.paperCount;
         coAuthors.updateIn([a], (s = Set()) => {
           return s.union(element.authors);
         });
         return a;
        });
      });
    });

    const tmpAuthors = fullAuthors.valueSeq().toArray();
    const tmpCoauthors = [];
    tmpAuthors.forEach((a) => {
      const initialCoauthors = coAuthors.get(a);
      a.coauthorCount = coAuthors.get(a).size - 1;
      initialCoauthors.forEach(element => {
        if(a.name !== element) {
          let tempEntry = {
            author1: a,
            author2: fullAuthors.get(element),
            count: 0,
            countsByYear: undefined
          };
          tmpCoauthors.push(tempEntry);
        }
      });
    });

    for (let i = 0; i < tmpAuthors.length; ++i) {
      this.db.authors.push(tmpAuthors[i]);
    }

    for (let i = 0; i < tmpCoauthors.length; ++i) {
      this.db.coauthors.push(tmpCoauthors[i]);
    }

    return Observable.of(this.db.authors);
  }
  getCoAuthorEdges(filter: Partial<Filter> = {}): Observable<CoAuthorEdge[]> {
    this.getAuthors(filter);
    return Observable.of(this.db.coauthors);
  }
  getGrants(filter: Partial<Filter> = {}): Observable<Grant[]> {
    return Observable.of(this.db.grants).map((grants) => {
      return !filter.year ? grants : grants.filter((g) => {
        return filter.year.start <= g.year && g.year <= filter.year.end;
      });
    }).delay(1);
  }
  getPublications(filter: Partial<Filter> = {}): Observable<Publication[]> {
    return Observable.of(this.db.publications);
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
