import { access, chain, constant, map, Operand } from '@ngx-dino/core';

import { Mappable, WithFirstYear, WithLastYear, WithDefaultStyles, WithNumPapers, WithNumPapers1, WithNumPapers2, WithNumCites, WithHIndex } from '../shared/mappers';

// @dynamic
export class Author extends WithHIndex(WithNumPapers1(WithNumPapers2(WithNumPapers(WithNumCites(WithFirstYear(WithLastYear(WithDefaultStyles(Mappable)))))))) {
  name: string;
  topTopicArea: string;
  topicAreas: string[];
  position: [number, number];

  @Operand<string>(constant('circle'))
  shape: string;

  @Operand<string>(map(a => a.hIndexNorm > 50 ? a.name : undefined))
  label: string;
}
