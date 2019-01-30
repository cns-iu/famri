import { orderBy } from 'lodash';
import { Publication } from './famri-publication';
import { Topic } from './famri-topic';

export function extractTopics(publications: Publication[]): Topic[] {
  const topics: any = {}, topicList: Topic[] = [];
  const globalStats = {};

  for (const pub of publications) {
    pub.topicAreas.forEach((name, index) => {
      let topic: Topic = topics[name];

      if (!topic) {
        topic = topics[name] = new Topic({
          name,
          numPapers: 0,
          numCites: 0,
          firstYear: pub.publicationYear || 0,
          lastYear: pub.publicationYear || 0,
          globalStats
        });
        topicList.push(topic);
      }

      topic.numPapers++;
      topic.numCites += pub.numCites || 0;
      if (pub.publicationYear) {
        if (pub.publicationYear < topic.firstYear) {
          topic.firstYear = pub.publicationYear;
        }
        if (pub.publicationYear > topic.lastYear) {
          topic.lastYear = pub.publicationYear;
        }
      }
    });
    pub.Topics = pub.topicAreas.map(a => topics[a]);
  }
  topicList.forEach(a => a.updateGlobalStats(globalStats));

  return orderBy(topicList, 'name', 'asc');
}
