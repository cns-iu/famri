import {
  Mappable, WithFirstYear, WithLastYear, WithDefaultStyles, WithNumPapers, WithNumPapers1, WithNumPapers2, WithNumCites, WithHIndex
} from '../shared/mappers';

export class Topic extends
    WithHIndex(WithNumPapers1(WithNumPapers2(WithNumPapers(WithNumCites(WithFirstYear(WithLastYear(WithDefaultStyles(Mappable)))))))) {
  name: string;
  position: [number, number];
}
