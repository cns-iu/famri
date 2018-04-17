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
}

export const database = new FamriDatabase();
