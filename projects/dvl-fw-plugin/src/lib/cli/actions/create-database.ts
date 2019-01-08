import { readJSON, readGexfFile, writeYAML } from '../utils';
import { extractPublications, extractAuthors, extractCoAuthorLinks, FamriDatabase } from '../../data-model';

export function createDatabase(pubsFile: string, coauthGexfFile: string, outYamlFile: string) {
  const pubs = readJSON(pubsFile);
  const graph = readGexfFile(coauthGexfFile);

  const publications = extractPublications(pubs);
  const authors = extractAuthors(publications, graph);
  const coAuthorLinks = extractCoAuthorLinks(publications);
  const database = new FamriDatabase({
    publications: publications.map(p => p.toJSON()),
    authors: authors.map(p => p.toJSON()),
    coAuthorLinks: coAuthorLinks.map(p => p.toJSON())
  });

  writeYAML(outYamlFile, database);
}
