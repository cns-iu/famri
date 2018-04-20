import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { Filter } from '../shared/filter';
import { Publication } from '../shared/publication';
import { Author, CoAuthorEdge, CoAuthorGraph } from '../shared/author';
import { Grant } from '../shared/grant';

import { SubdisciplineWeight } from '../shared/subdiscipline-weight';
import { database } from './database';

export const DEFAULT_FILTER: Partial<Filter> = {year: {start: 2002, end: 2017}};

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
    filter = Object.assign({}, DEFAULT_FILTER, filter);
    return Observable.of(this.db.authors).map((authors) => {
      return this.filterAuthors(filter);
    }).delay(1);
  }
  private filterAuthors(filter: Partial<Filter> = {}): Author[] {
    filter = Object.assign({}, DEFAULT_FILTER, filter);
    let filtered = this.db.authors;
    if (filter.year) {
      const years = [];
      for (let yr = filter.year.start; yr <= filter.year.end; yr++) {
        years.push(yr);
      }
      filtered = filtered.filter((a) => {
        return years.filter((y) => a.paperCountsByYear[y]).length > 0;
      });
      if (filter.year) {
        const years = [];
        for (let yr = filter.year.start; yr <= filter.year.end; yr++) {
          years.push(yr);
        }
        filtered = filtered.map((a) => {
          const paperCount = years.reduce((acc, y) => (a.paperCountsByYear[y] || 0) + acc, 0);
          if (paperCount > 0) {
            const coauthors = {};
            years.forEach((yr) => {
              for (const authorId in (a.coauthorsByYear || {})) {
                coauthors[authorId] = true;
              }
            });
            let coauthorCount = 0;
            for (const a in coauthors) { coauthorCount++; }
            return Object.assign(a, {paperCount, coauthorCount});
          } else {
            return null;
          }
        }).filter((a) => !!a);
      }
      filtered.sort((a,b) => b.paperCount - a.paperCount);
    }
    if (filter.limit && filter.limit > 0) {
      filtered = filtered.slice(0, filter.limit);
    }
    return filtered;
  }

  getCoAuthorEdges(filter: Partial<Filter> = {}): Observable<CoAuthorEdge[]> {
    filter = Object.assign({}, DEFAULT_FILTER, filter);
    return this.getCoAuthorGraph(filter).map((graph) => graph.coauthorEdges);
  }

  getCoAuthorGraph(filter: Partial<Filter> = {}): Observable<CoAuthorGraph> {
    filter = Object.assign({}, DEFAULT_FILTER, filter);
    const all: CoAuthorGraph = {
      authors: this.db.authors,
      coauthorEdges: this.db.coauthorEdges
    };
    return Observable.of(all).map((a) => {
        const authors = this.filterAuthors(filter);
        if (authors.length === a.authors.length) {
          return a;
        } else {
          let edges = this.db.coauthorNetwork.getEdges(authors);
          if (filter.year) {
            const years = [];
            for (let yr = filter.year.start; yr <= filter.year.end; yr++) {
              years.push(yr);
            }
            edges = edges.map((e) => {
              const count = years.reduce((acc, y) => (e.countsByYear[y] || 0) + acc, 0);
              if (count > 0) {
                return Object.assign({}, e, {count});
              } else {
                return null;
              }
            }).filter((e) => !!e);
          }
          edges.sort((a,b) => b.count - a.count);
          // edges = edges.filter(e => e.count > 1);
          return {authors, coauthorEdges: edges};
        }
      }).delay(1);
  }

  getGrants(filter: Partial<Filter> = {}): Observable<Grant[]> {
    filter = Object.assign({}, DEFAULT_FILTER, filter);
    return Observable.of(this.db.grants).map((grants) => {
      return !filter.year ? grants : grants.filter((g) => {
        return filter.year.start <= g.year && g.year <= filter.year.end;
      });
    }).delay(1);
  }

  getPublications(filter: Partial<Filter> = {}): Observable<Publication[]> {
    filter = Object.assign({}, DEFAULT_FILTER, filter);
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
    filter = Object.assign({}, DEFAULT_FILTER, filter);
    return this.getPublications(filter).map((publications) => {
      const weights = sumAgg<Publication>(publications, 'subdisciplines', 'subd_id', 'weight');
      return Object.entries(weights).map(([k, v]) => <SubdisciplineWeight>{subd_id: <number>(<any>k), weight: v});
    }).delay(1);
  }

  getDistinct(fieldName: string, filter: Partial<Filter> = {}): Observable<string[]> {
    filter = Object.assign({}, DEFAULT_FILTER, filter);
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
