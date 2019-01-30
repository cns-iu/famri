import { Mappable, WithFirstYear, WithLastYear, WithDefaultStyles, WithNumPapers, WithNumCites } from '../shared/mappers';

export class Topic extends WithNumPapers(WithNumCites(WithFirstYear(WithLastYear(WithDefaultStyles(Mappable))))) {
  name: string;
}
