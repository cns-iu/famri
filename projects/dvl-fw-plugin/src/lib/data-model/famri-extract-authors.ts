import { Graph } from 'graphology';
import { orderBy } from 'lodash';

import { Author, AuthorStats } from './famri-author';
import { Publication } from './famri-publication';


function hIndex(cites: number[]): number {
  return cites.sort((n1, n2) => n2 - n1).filter((n, i) => n > i).length;
}

export function extractAuthors(publications: Publication[], coauthorNetwork?: Graph): Author[] {
  const authors: any = {}, authorList: Author[] = [];
  const globalStats = new AuthorStats();

  const positions = {};
  if (coauthorNetwork) {
    coauthorNetwork.forEachNode((name, attributes) => {
      positions[name] = [attributes.x, attributes.y];
    });
  }

  for (const pub of publications) {
    pub.authors.forEach((name, index) => {
      let author: Author = authors[name];

      if (!author) {
        author = authors[name] = new Author({
          name,
          // fullname: pub.authorsFullname[index] || name,
          topicArea: pub.topicArea,
          numPapers: 0,
          numCites: 0,
          sortedCites: [],
          hIndex: 0,
          firstYear: pub.publicationYear || 0,
          lastYear: pub.publicationYear || 0,
          position: positions[name] || undefined,
          globalStats
        });
        authorList.push(author);
      }

      author.numPapers++;
      author.numCites += pub.numCites || 0;
      if (pub.hasCites) {
        author.sortedCites.push(pub.numCites);
      }
      if (pub.publicationYear) {
        if (pub.publicationYear < author.firstYear) {
          author.firstYear = pub.publicationYear;
        }
        if (pub.publicationYear > author.lastYear) {
          author.lastYear = pub.publicationYear;
        }
      }
    });
    pub.Authors = pub.authors.map(a => authors[a]);
  }
  for (const a of authorList) {
    a.sortedCites = a.sortedCites.sort((n1, n2) => n2 - n1);
    a.hIndex = hIndex(a.sortedCites);
    globalStats.count(a);
  }
  orderBy(authorList, 'hIndex', 'desc');
  authorList.forEach(a => globalStats.count(a));
  return authorList;
}
