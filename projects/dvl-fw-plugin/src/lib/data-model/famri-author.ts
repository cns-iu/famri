import { access, chain, constant, map, Operand } from '@ngx-dino/core';

import {
  Mappable, WithFirstYear, WithLastYear, WithDefaultStyles,
  WithNumPapers, WithNumPapers1, WithNumPapers2,
  WithNumCites, WithNumCites1, WithNumCites2,
  WithHIndex, WithHIndex1, WithHIndex2
} from '../shared/mappers';

// @dynamic
export class Author extends
    WithHIndex1(WithHIndex2(WithHIndex(
    WithNumPapers1(WithNumPapers2(WithNumPapers(
    WithNumCites1(WithNumCites2(WithNumCites(
    WithFirstYear(WithLastYear(WithDefaultStyles(Mappable)))))))))))) {
  name: string;
  topTopicArea: string;
  topicAreas: string[];
  position: [number, number];

  @Operand<string>(constant('circle'))
  shape: string;

  @Operand<string>(map(a => a.hIndexNorm > 50 ? a.name : undefined))
  label: string;
}
