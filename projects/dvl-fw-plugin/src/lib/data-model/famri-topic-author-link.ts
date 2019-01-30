import { access, chain, combine, map, Operand } from '@ngx-dino/core';

import { Mappable, WithFirstYear, WithLastYear, WithDefaultStyles, WithNumPapers, WithNumCites } from '../shared/mappers';
import { Author } from './famri-author';
import { Topic } from './famri-topic';

export class TopicAuthorLink extends WithNumPapers(WithNumCites(WithFirstYear(WithLastYear(WithDefaultStyles(Mappable))))) {
  topic: string;
  author: string;

  // @Transient
  Topic: Topic;
  // @Transient
  Author: Author;

  @Operand<string>(chain(combine([access('topic'), access('author')]), map(([a1, a2]) => a1 + a2)))
  identifier: string;
}
