import { Topic } from './famri-topic';
import { access, chain, map, Operand } from '@ngx-dino/core';
import { assignIn } from 'lodash';

import {
  areaSizeScaleNormQuantitative, fontSizeScaleNormQuantitative, formatNumber, formatYear,
  colorScaleNormQuantitative, colorScaleNormQuantitativeStroke, norm0to100, quantitativeTransparency,
  defaultStyles, Transient
} from '../shared/encodings';
import { Author } from './famri-author';


export class PublicationStats {
  numCitesMax = 0;
  yearMax = 0;
  yearMin = 9999;

  count(publication: Publication) {
    if (publication.numCites) {
      this.numCitesMax = Math.max(this.numCitesMax, publication.numCites);
    }
    if (publication.publicationYear) {
      this.yearMax = Math.max(this.yearMax, publication.publicationYear);
      this.yearMin = Math.min(this.yearMin, publication.publicationYear);
    }
  }
}

// @dynamic
export class Publication {
  id: string;
  title: string;
  issn: string;
  eissn: string;
  journalName: string;
  journalFullname: string;
  topicAreas: string[];
  authors: string[];
  authorsFullname: string[];
  authorsAddress: string[];
  publicationYear: number;
  abstract: string;
  publicationType: string;
  issue: number;
  numCites: number;
  hasCites: boolean;
  globalStats: PublicationStats;
  defaultStyles = defaultStyles;

  constructor(data: any) {
    Object.assign(this, data);
  }

  // @Transient
  Authors: Author[];
  // @Transient
  Topics: Topic[];

  @Operand<string>(chain(access<string[]>('authors'), map(s => s.join(', '))))
  authorsLabel: string;

  // #Cites Encodings
  @Operand<number>(norm0to100('numCites', 'globalStats.numCitesMax'))
  numCitesNorm: number;
  @Operand<string>(chain(access('numCites'), formatNumber))
  numCitesLabel: string;
  @Operand<number>(chain(access('numCitesNorm'), areaSizeScaleNormQuantitative))
  numCitesAreaSize: number;
  @Operand<number>(chain(access('numCitesNorm'), fontSizeScaleNormQuantitative))
  numCitesFontSize: number;
  @Operand<string>(chain(access('numCitesNorm'), colorScaleNormQuantitative))
  numCitesColor: string;
  @Operand<string>(chain(access('numCitesNorm'), colorScaleNormQuantitativeStroke))
  numCitesStrokeColor: string;
  @Operand<number>(chain(access<number>('numCitesNorm'), quantitativeTransparency))
  numCitesTransparency: number;

  // First Year Encodings
  @Operand<number>(norm0to100('publicationYear', 'globalStats.yearMax', 'globalStats.yearMin'))
  publicationYearNorm: number;
  @Operand<string>(chain(access('publicationYear'), formatYear))
  publicationYearLabel: string;
  @Operand<number>(chain(access('publicationYearNorm'), areaSizeScaleNormQuantitative))
  publicationYearAreaSize: number;
  @Operand<number>(chain(access('publicationYearNorm'), fontSizeScaleNormQuantitative))
  publicationYearFontSize: number;
  @Operand<string>(chain(access('publicationYearNorm'), colorScaleNormQuantitative))
  publicationYearColor: string;
  @Operand<string>(chain(access('publicationYearNorm'), colorScaleNormQuantitativeStroke))
  publicationYearStrokeColor: string;

  toJSON(): any {
    return assignIn({}, this);
  }
}
