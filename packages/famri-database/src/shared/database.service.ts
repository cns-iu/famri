import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Map, Set } from 'immutable';

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
    const fullAuthors = Map<string, Author>().asMutable();
    const coAuthors = Map<Author, Set<string>>().asMutable();
    const filteredByYear = publications.filter(
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
      authors.push(tmpAuthors[i]);
    }
    
    for (let i = 0; i < tmpCoauthors.length; ++i) {
      coauthors.push(tmpCoauthors[i]);
    }
  
    return Observable.of(authors);
  }
  getCoAuthorEdges(filter: Partial<Filter> = {}): Observable<CoAuthorEdge[]> {
    this.getAuthors(filter);
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
