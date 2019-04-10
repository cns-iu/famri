// refer https://angular.io/guide/styleguide#style-03-06 for import line spacing
import { CoAuthorLink, CoAuthorLinkStats } from './famri-coauthor-link';
import { Publication } from './famri-publication';
import { sortBy, toLower } from 'lodash';

// Assumes this was run after extractAuthors
export function extractCoAuthorLinks(publications: Publication[]): CoAuthorLink[] {
  const coAuthorLinks: any = {}, coAuthorLinkList: CoAuthorLink[] = [];
  const globalStats = new CoAuthorLinkStats();
  for (const pub of publications) {
    const authors = sortBy(pub.Authors, 'name');
    authors.forEach((author1, index) => {
      for (const author2 of authors.slice(index + 1)) {
        const id = toLower(`${author1.name}---${author2.name}`);
        let coAuthorLink: CoAuthorLink = coAuthorLinks[id];
        if (!coAuthorLink) {
          coAuthorLink = coAuthorLinks[id] = new CoAuthorLink({
            author1: author1.name,
            author2: author2.name,
            numPapers: 0,
            numPapers1: 0,
            numPapers2: 0,
            numCites: 0,
            numCites1: 0,
            numCites2: 0,
            firstYear: pub.publicationYear || 0,
            lastYear: pub.publicationYear || 0,
            Author1: author1,
            Author2: author2,
            globalStats
          });
          coAuthorLinkList.push(coAuthorLink);
        }

        coAuthorLink.numPapers++;
        coAuthorLink.numCites += pub.numCites || 0;
        if (pub.publicationYear) {
          if (pub.publicationYear <= 2005) {
            coAuthorLink.numPapers1++;
            coAuthorLink.numCites1 += pub.numCites || 0;
          }
          if (pub.publicationYear <= 2009) {
            coAuthorLink.numPapers2++;
            coAuthorLink.numCites2 += pub.numCites || 0;
          }
          if (pub.publicationYear < coAuthorLink.firstYear) {
            coAuthorLink.firstYear = pub.publicationYear;
          }
          if (pub.publicationYear > coAuthorLink.lastYear) {
            coAuthorLink.lastYear = pub.publicationYear;
          }
        }
      }
    });
  }
  coAuthorLinkList.forEach(a => globalStats.count(a));
  return coAuthorLinkList;
}
