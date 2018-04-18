import { Map, Set } from 'immutable';

import { Filter } from '../shared/filter';
import { Author, CoAuthorEdge } from '../shared/author';
import { database } from './database';

export class Network {
  static db = database;

  constructor() { }

  static getAuthorsList(filter: Partial<Filter> = {}): any[] {
    const fullAuthors = Map<string, Author>().asMutable();
    const coAuthors = Map<Author, Set<string>>().asMutable();
    let filteredByYear = [];
    if (filter.year) {
      filteredByYear = this.db.publications.filter(
        (pubs) => pubs.year > filter.year.start && pubs.year < filter.year.end
      );
    } else {
      filteredByYear = this.db.publications;
    }
    filteredByYear.forEach(element => {
      element.authors.forEach(author => {
        fullAuthors.update(author, (a = {
          id: author.trim(),
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
        if (a.id !== element) {
          let tempEntry = {
            source: a.id.trim(),
            target: element.trim(),
            count: 1,
            countsByYear: undefined
          };
          tmpCoauthors.push(tempEntry);
        }
      });
    });

    this.db.authors = [];
    this.db.coauthors = [];
    
    const topCoAuthors = 10;
    const authorIds = {};
    tmpAuthors.sort((a,b) => b.coauthorCount - a.coauthorCount);
    for (let i = 0; i < Math.min(topCoAuthors, tmpAuthors.length);  ++i) {
      const author = tmpAuthors[i];
      this.db.authors.push(author);
      authorIds[author.id] = author;
    }

    for (const edge of tmpCoauthors) {
      if (authorIds.hasOwnProperty(edge.source) && authorIds.hasOwnProperty(edge.target)){
        this.db.coauthors.push(edge);
      }
    }
    return this.db.authors;
  }

  static getCoauthorsList(filter: Partial<Filter> = {}): any[] {
    return this.db.coauthors;
  }
}
