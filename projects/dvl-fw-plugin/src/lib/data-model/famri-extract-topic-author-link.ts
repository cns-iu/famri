import { TopicAuthorLink } from './famri-topic-author-link';
import { Publication } from './famri-publication';
import { sortBy, orderBy, toLower } from 'lodash';
import { Author } from './famri-author';
import { Topic } from './famri-topic';

// Assumes this was run after extractAuthors
export function extractTopicAuthorLinks(publications: Publication[]): TopicAuthorLink[] {
  const topicAuthorLinks: any = {}, topicAuthorLinkList: TopicAuthorLink[] = [];
  const globalStats = {};
  for (const pub of publications) {
    const authors: Author[] = sortBy(pub.Authors, 'name');
    const topics: Topic[] = sortBy(pub.Topics, 'name');
    topics.forEach((topic) => {
      for (const author of authors) {
        const id = toLower(`${topic.name}---${author.name}`);
        let topicAuthorLink: TopicAuthorLink = topicAuthorLinks[id];
        if (!topicAuthorLink) {
          topicAuthorLink = topicAuthorLinks[id] = new TopicAuthorLink({
            topic: topic.name,
            author: author.name,
            numPapers: 0,
            numCites: 0,
            firstYear: pub.publicationYear || 0,
            lastYear: pub.publicationYear || 0,
            Topic: topic,
            Author: author,
            globalStats
          });
          topicAuthorLinkList.push(topicAuthorLink);
        }

        topicAuthorLink.numPapers++;
        topicAuthorLink.numCites += pub.numCites || 0;
        if (pub.publicationYear < topicAuthorLink.firstYear) {
          topicAuthorLink.firstYear = pub.publicationYear;
        }
        if (pub.publicationYear > topicAuthorLink.lastYear) {
          topicAuthorLink.lastYear = pub.publicationYear;
        }
      }
    });
  }
  topicAuthorLinkList.forEach(a => a.updateGlobalStats(globalStats));
  return orderBy(topicAuthorLinkList, ['topic', 'author'], ['asc', 'asc']);
}
