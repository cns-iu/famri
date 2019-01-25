import { Publication } from './famri-publication';
import { Author } from './famri-author';
import { CoAuthorLink } from './famri-coauthor-link';


export class FamriDatabase {
  publications: Publication[];
  authors: Author[];
  coAuthorLinks: CoAuthorLink[];

  constructor(data: any) {
    Object.assign(this, data);
  }
}
