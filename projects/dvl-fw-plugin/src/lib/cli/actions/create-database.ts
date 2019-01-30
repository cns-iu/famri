import { readJSON, readGexfFile, writeYAML } from '../utils';
import { extractPublications, extractAuthors, extractCoAuthorLinks, extractTopics, FamriDatabase } from '../../data-model';
import { extractTopicAuthorLinks } from '../../data-model/famri-extract-topic-author-link';

export function createDatabase(pubsFile: string, coauthGexfFile: string, outYamlFile: string) {
  const pubs = readJSON(pubsFile);
  const graph = readGexfFile(coauthGexfFile);

  const publications = extractPublications(pubs);
  const authors = extractAuthors(publications, graph);
  const topics = extractTopics(publications);
  const coAuthorLinks = extractCoAuthorLinks(publications);
  const topicAuthorLinks = extractTopicAuthorLinks(publications);
  const database = new FamriDatabase({
    publications: publications.map(p => p.toJSON()),
    authors: authors.map(p => p.toJSON()),
    topics: topics.map(p => p.toJSON()),
    coAuthorLinks: coAuthorLinks.map(p => p.toJSON()),
    topicAuthorLinks: topicAuthorLinks.map(p => p.toJSON())
  });

  writeYAML(outYamlFile, database);
}
