import { Filter } from '../shared/filter';
import { Publication } from '../shared/publication';
import { Author, CoAuthorEdge } from '../shared/author';
import { Grant } from '../shared/grant';

import * as rawDatabase from '../../../../raw-data/database.json';

export class FamriDatabase {
  grants: Grant[] = rawDatabase.grants;
  publications: Publication[] = rawDatabase.publications;
  authors: Author[] = [];
  coauthors: CoAuthorEdge[] = [];

  constructor() {
    const id2pub: any = {};
    this.publications.forEach((p) => id2pub[p.id] = p);
    this.grants.forEach((g) => {
      g.publications = (g.publicationIds || []).map((id) => id2pub[id]).filter((s) => !!s);
      g.publications.forEach((p) => p.grant = g);
    });
  }
}

export const database = new FamriDatabase();
