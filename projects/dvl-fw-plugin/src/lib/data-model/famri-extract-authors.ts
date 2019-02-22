import { Graph } from 'graphology';
import { orderBy, uniq, reduce, maxBy } from 'lodash';

import { Author } from './famri-author';
import { Publication } from './famri-publication';


function hIndex(cites: number[]): number {
  return cites.sort((n1, n2) => n2 - n1).filter((n, i) => n > i).length;
}

export function extractAuthors(publications: Publication[], coauthorNetwork?: Graph): Author[] {
  const authors: any = {}, authorList: Author[] = [];
  const globalStats: any = {};

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
          topicAreas: [],
          numPapers: 0,
          numPapers1: 0,
          numPapers2: 0,
          numCites: 0,
          numCites1: 0,
          numCites2: 0,
          hIndex: 0,
          hIndex1: 0,
          hIndex2: 0,
          sortedCites: [],
          sortedCites1: [],
          sortedCites2: [],
          firstYear: pub.publicationYear || 0,
          lastYear: pub.publicationYear || 0,
          position: positions[name] || undefined,
          globalStats
        });
        authorList.push(author);
      }

      author.topicAreas = author.topicAreas.concat(pub.topicAreas);
      author.numPapers++;
      author.numCites += pub.numCites || 0;
      if (pub.hasCites) {
        author.sortedCites.push(pub.numCites);
      }
      if (pub.publicationYear) {
        if (pub.publicationYear <= 2005) {
          author.numPapers1++;
          author.numCites1 += pub.numCites || 0;
          if (pub.hasCites) {
            author.sortedCites1.push(pub.numCites);
          }
        } else if (pub.publicationYear <= 2009) {
          author.numPapers2++;
          author.numCites2 += pub.numCites || 0;
          if (pub.hasCites) {
            author.sortedCites2.push(pub.numCites);
          }
        }
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
    const hist = reduce(a.topicAreas, (acc, val) => (acc[val] = (acc[val] || 0) + 1, acc), {});
    a.topTopicArea = maxBy(Object.entries(hist), i => i[1])[0];
    a.topicAreas = uniq(a.topicAreas.sort());
    a.updateGlobalStats(globalStats);
  }
  return orderBy(authorList, 'name', 'asc');
}
