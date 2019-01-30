import { TopicAuthorLink } from './famri-topic-author-link';
import { Topic } from './famri-topic';
import { Publication } from './famri-publication';
import { Author } from './famri-author';
import { CoAuthorLink } from './famri-coauthor-link';


export class FamriDatabase {
  publications: Publication[];
  authors: Author[];
  topics: Topic[];
  coAuthorLinks: CoAuthorLink[];
  topicAuthorLinks: TopicAuthorLink[];

  constructor(data: any) {
    Object.assign(this, data);
  }
}
