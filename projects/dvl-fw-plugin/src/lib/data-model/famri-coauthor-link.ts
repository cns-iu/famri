// refer https://angular.io/guide/styleguide#style-03-06 for import line spacing
import { access, chain, combine, map, Operand } from '@ngx-dino/core';
import { assignIn } from 'lodash';

import {
  areaSizeScaleNormQuantitative, fontSizeScaleNormQuantitative, strokeWidthScaleNormQuantitative,
  colorScaleNormQuantitative, colorScaleNormQuantitativeStroke,
  norm0to100, formatNumber, formatYear, quantitativeTransparency, defaultStyles, Transient
} from '../shared/encodings';
import { Author } from './famri-author';


export class CoAuthorLinkStats {
  numPapersMax = 0;
  numCitesMax = 0;
  yearMax = 0;
  yearMin = 9999;

  count(item: CoAuthorLink) {
    this.numPapersMax = Math.max(this.numPapersMax, item.numPapers);
    this.numCitesMax = Math.max(this.numCitesMax, item.numCites);
    this.yearMax = Math.max(this.yearMax, item.firstYear, item.lastYear);
    if (item.firstYear > 0) {
      this.yearMin = Math.min(this.yearMin, item.firstYear);
    }
    if (item.lastYear > 0) {
      this.yearMin = Math.min(this.yearMin, item.lastYear);
    }
  }
}

// @dynamic
export class CoAuthorLink {
  author1: string;
  author2: string;
  numPapers: number;
  numPapers1: number;
  numPapers2: number;
  numCites: number;
  numCites1: number;
  numCites2: number;
  firstYear: number;
  lastYear: number;
  globalStats: CoAuthorLinkStats;
  defaultStyles = defaultStyles;

  constructor(data: any) {
    Object.assign(this, data);
  }

  // @Transient
  Author1: Author;
  // @Transient
  Author2: Author;

  @Operand<string>(chain(combine([access('author1'), access('author2')]), map(([a1, a2]) => a1 + a2)))
  identifier: string;

  // Positions
  @Operand<[number, number]>(access('Author1.position'))
  source: [number, number];
  @Operand<[number, number]>(access('Author2.position'))
  target: [number, number];

  // #Papers Encodings
  @Operand<number>(norm0to100('numPapers', 'globalStats.numPapersMax'))
  numPapersNorm: number;
  @Operand<string>(chain(access('numPapers'), formatNumber))
  numPapersLabel: string;
  @Operand<number>(chain(access('numPapersNorm'), areaSizeScaleNormQuantitative))
  numPapersAreaSize: number;
  @Operand<number>(chain(access('numPapersNorm'), strokeWidthScaleNormQuantitative))
  numPapersStrokeWidth: number;
  @Operand<number>(chain(access('numPapersNorm'), fontSizeScaleNormQuantitative))
  numPapersFontSize: number;
  @Operand<string>(chain(access('numPapersNorm'), colorScaleNormQuantitative))
  numPapersColor: string;
  @Operand<string>(chain(access('numPapersNorm'), colorScaleNormQuantitativeStroke))
  numPapersStrokeColor: string;
  @Operand<number>(chain(access<number>('numPapersNorm'), quantitativeTransparency))
  numPapersTransparency: number;

  // #Cites Encodings
  @Operand<number>(norm0to100('numCites', 'globalStats.numCitesMax'))
  numCitesNorm: number;
  @Operand<string>(chain(access('numCites'), formatNumber))
  numCitesLabel: string;
  @Operand<number>(chain(access('numCitesNorm'), areaSizeScaleNormQuantitative))
  numCitesAreaSize: number;
  @Operand<number>(chain(access('numCitesNorm'), strokeWidthScaleNormQuantitative))
  numCitesStrokeWidth: number;
  @Operand<number>(chain(access('numCitesNorm'), fontSizeScaleNormQuantitative))
  numCitesFontSize: number;
  @Operand<string>(chain(access('numCitesNorm'), colorScaleNormQuantitative))
  numCitesColor: string;
  @Operand<string>(chain(access('numCitesNorm'), colorScaleNormQuantitativeStroke))
  numCitesStrokeColor: string;

  // First Year Encodings
  @Operand<number>(norm0to100('firstYear', 'globalStats.yearMax', 'globalStats.yearMin'))
  firstYearNorm: number;
  @Operand<string>(chain(access('firstYear'), formatYear))
  firstYearLabel: string;
  @Operand<number>(chain(access('firstYearNorm'), areaSizeScaleNormQuantitative))
  firstYearAreaSize: number;
  @Operand<number>(chain(access('firstYearNorm'), strokeWidthScaleNormQuantitative))
  firstYearStrokeWidth: number;
  @Operand<number>(chain(access('firstYearNorm'), fontSizeScaleNormQuantitative))
  firstYearFontSize: number;
  @Operand<string>(chain(access('firstYearNorm'), colorScaleNormQuantitative))
  firstYearColor: string;
  @Operand<string>(chain(access('firstYearNorm'), colorScaleNormQuantitativeStroke))
  firstYearStrokeColor: string;

  // Last Year Encodings
  @Operand<number>(norm0to100('lastYear', 'globalStats.yearMax', 'globalStats.yearMin'))
  lastYearNorm: number;
  @Operand<string>(chain(access('lastYear'), formatYear))
  lastYearLabel: string;
  @Operand<number>(chain(access('lastYearNorm'), areaSizeScaleNormQuantitative))
  lastYearAreaSize: number;
  @Operand<number>(chain(access('lastYearNorm'), strokeWidthScaleNormQuantitative))
  lastYearStrokeWidth: number;
  @Operand<number>(chain(access('lastYearNorm'), fontSizeScaleNormQuantitative))
  lastYearFontSize: number;
  @Operand<string>(chain(access('lastYearNorm'), colorScaleNormQuantitative))
  lastYearColor: string;
  @Operand<string>(chain(access('lastYearNorm'), colorScaleNormQuantitativeStroke))
  lastYearStrokeColor: string;

  toJSON(): any {
    return assignIn({}, this);
  }
}
