
import { access, chain, Operand } from '@ngx-dino/core';
import { assignIn } from 'lodash';

import {
  areaSizeScaleNormQuantitative, fontSizeScaleNormQuantitative,
  colorScaleNormQuantitative, colorScaleNormQuantitativeStroke,
  norm0to100, formatNumber, formatYear, quantitativeTransparency, defaultStyles
} from '../shared/encodings';

export class Mappable {
  constructor(data: any) {
    Object.assign(this, data);
  }

  updateGlobalStats(globalStats: any) {}

  toJSON(): any {
    return assignIn({}, this);
  }
}

type Constructor<T> = new(...args: any[]) => T;

export function WithDefaultStyles<T extends Constructor<Mappable>>(Base: T, defaults: any = defaultStyles) {
  class DefaultStyles extends Base {
    defaultStyles = defaults;
  }
  return DefaultStyles;
}

export function WithFirstYear<T extends Constructor<Mappable>>(Base: T) {
  class FirstYear extends Base {
    firstYear: number;

    // First Year Encodings
    @Operand<number>(norm0to100('firstYear', 'globalStats.yearMax', 'globalStats.yearMin'))
    firstYearNorm: number;
    @Operand<string>(chain(access('firstYear'), formatYear))
    firstYearLabel: string;
    @Operand<number>(chain(access('firstYearNorm'), areaSizeScaleNormQuantitative))
    firstYearAreaSize: number;
    @Operand<number>(chain(access('firstYearNorm'), fontSizeScaleNormQuantitative))
    firstYearFontSize: number;
    @Operand<string>(chain(access('firstYearNorm'), colorScaleNormQuantitative))
    firstYearColor: string;
    @Operand<string>(chain(access('firstYearNorm'), colorScaleNormQuantitativeStroke))
    firstYearStrokeColor: string;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      globalStats.yearMax = Math.max(globalStats.yearMax || 0, this.firstYear);
      if (this.firstYear > 0) {
        globalStats.yearMin = Math.min(globalStats.yearMin || 9999, this.firstYear);
      }
    }
  }
  return FirstYear;
}

export function WithLastYear<T extends Constructor<Mappable>>(Base: T) {
  class LastYear extends Base {
    lastYear: number;

    // Last Year Encodings
    @Operand<number>(norm0to100('lastYear', 'globalStats.yearMax', 'globalStats.yearMin'))
    lastYearNorm: number;
    @Operand<string>(chain(access('lastYear'), formatYear))
    lastYearLabel: string;
    @Operand<number>(chain(access('lastYearNorm'), areaSizeScaleNormQuantitative))
    lastYearAreaSize: number;
    @Operand<number>(chain(access('lastYearNorm'), fontSizeScaleNormQuantitative))
    lastYearFontSize: number;
    @Operand<string>(chain(access('lastYearNorm'), colorScaleNormQuantitative))
    lastYearColor: string;
    @Operand<string>(chain(access('lastYearNorm'), colorScaleNormQuantitativeStroke))
    lastYearStrokeColor: string;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      globalStats.yearMax = Math.max(globalStats.yearMax || 0, this.lastYear);
      if (this.lastYear > 0) {
        globalStats.yearMin = Math.min(globalStats.yearMin || 9999, this.lastYear);
      }
    }
  }
  return LastYear;
}

export function WithNumPapers<T extends Constructor<Mappable>>(Base: T) {
  class NumPapers extends Base {
    numPapers: number;

    // #Papers Encodings
    @Operand<number>(norm0to100('numPapers', 'globalStats.numPapersMax'))
    numPapersNorm: number;
    @Operand<string>(chain(access('numPapers'), formatNumber))
    numPapersLabel: string;
    @Operand<number>(chain(access('numPapersNorm'), areaSizeScaleNormQuantitative))
    numPapersAreaSize: number;
    @Operand<number>(chain(access('numPapersNorm'), fontSizeScaleNormQuantitative))
    numPapersFontSize: number;
    @Operand<string>(chain(access('numPapersNorm'), colorScaleNormQuantitative))
    numPapersColor: string;
    @Operand<string>(chain(access('numPapersNorm'), colorScaleNormQuantitativeStroke))
    numPapersStrokeColor: string;
    @Operand<number>(chain(access<number>('numPapersNorm'), quantitativeTransparency))
    numPapersTransparency: number;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      globalStats.numPapersMax = Math.max(globalStats.numPapersMax || 0, this.numPapers);
    }
  }
  return NumPapers;
}

export function WithNumCites<T extends Constructor<Mappable>>(Base: T) {
  class NumCites extends Base {
    numCites: number;

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

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      globalStats.numCitesMax = Math.max(globalStats.numCitesMax || 0, this.numCites);
    }
  }
  return NumCites;
}
