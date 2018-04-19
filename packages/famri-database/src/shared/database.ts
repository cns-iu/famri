import { Filter } from '../shared/filter';
import { Publication } from '../shared/publication';
import { Author, CoAuthorEdge } from '../shared/author';
import { Grant } from '../shared/grant';

import * as rawDatabase from '../../../../raw-data/database.json';
import { CoAuthorNetwork } from './coauthor-network';

const NOT_SCIMAPPED = [{subd_id: -1, weight: 1}];

export class FamriDatabase {
  readonly grants: Grant[] = rawDatabase.grants;
  readonly publications: Publication[] = rawDatabase.publications;
  readonly coauthorNetwork: CoAuthorNetwork;
  readonly authors: Author[];
  readonly coauthorEdges: CoAuthorEdge[];

  constructor() {
    const id2pub: any = {};
    this.publications.forEach((p) => {
      id2pub[p.id] = p;
      if (!p.subdisciplines || p.subdisciplines.length === 0) {
        p.subdisciplines = NOT_SCIMAPPED;
      }
    });
    this.grants.forEach((g) => {
      g.publications = (g.publicationIds || []).map((id) => id2pub[id]).filter((s) => !!s);
      g.publications.forEach((p) => p.grant = g);
    });

    this.coauthorNetwork = new CoAuthorNetwork(rawDatabase.publications);
    this.authors = this.coauthorNetwork.authors;
    this.coauthorEdges = this.coauthorNetwork.coauthorEdges;
  }
}

export const database = new FamriDatabase();
