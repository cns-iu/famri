// refer https://angular.io/guide/styleguide#style-03-06 for import line spacing
import { isNumber, startCase, toLower, uniq } from 'lodash';

import { Publication, PublicationStats } from './famri-publication';
import { FamriRecord } from './famri-record';


export function extractPublications(publications: FamriRecord[]): Publication[] {
  const publicationList: Publication[] = [];
  const globalStats = new PublicationStats();
  for (const pub of publications) {
    const publication = new Publication({
      id: pub.recNumber,
      title: pub.title,
      issn: pub.isbn ? pub.isbn.split('\r')[0] : undefined,
      eissn: pub.isbn ? pub.isbn.split('\r').slice(-1)[0] : undefined,
      topicArea: pub.custom4,
      journalName: pub.journal,
      authors: uniq(pub.authors || []), // .map(s => startCase(toLower(s.trim())))),
      publicationYear: isNumber(Number(pub.year)) ? Number(pub.year) : 0,
      abstract: pub.abstract,
      publicationType: pub.type,
      issue: pub.volume,
      numCites: pub.custom5 === '-' ? 0 : isNumber(Number(pub.custom5)) ? Number(pub.custom5) : 0,
      globalStats
    });
    publicationList.push(publication);
  }
  publicationList.forEach(a => globalStats.count(a));
  return publicationList;
}
