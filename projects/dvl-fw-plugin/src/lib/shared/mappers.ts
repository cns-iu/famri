
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

export function WithNumCites1<T extends Constructor<Mappable>>(Base: T) {
  class NumCites1 extends Base {
    numCites1: number;

    // #Cites Encodings
    @Operand<number>(norm0to100('numCites1', 'globalStats.numCitesMax'))
    numCites1Norm: number;
    @Operand<string>(chain(access('numCites1'), formatNumber))
    numCites1Label: string;
    @Operand<number>(chain(access('numCites1Norm'), areaSizeScaleNormQuantitative))
    numCites1AreaSize: number;
    @Operand<number>(chain(access('numCites1Norm'), fontSizeScaleNormQuantitative))
    numCites1FontSize: number;
    @Operand<string>(chain(access('numCites1Norm'), colorScaleNormQuantitative))
    numCites1Color: string;
    @Operand<string>(chain(access('numCites1Norm'), colorScaleNormQuantitativeStroke))
    numCites1StrokeColor: string;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      globalStats.numCitesMax = Math.max(globalStats.numCitesMax || 0, this.numCites1);
    }
  }
  return NumCites1;
}

export function WithNumCites2<T extends Constructor<Mappable>>(Base: T) {
  class NumCites2 extends Base {
    numCites2: number;

    // #Cites Encodings
    @Operand<number>(norm0to100('numCites2', 'globalStats.numCitesMax'))
    numCites2Norm: number;
    @Operand<string>(chain(access('numCites2'), formatNumber))
    numCites2Label: string;
    @Operand<number>(chain(access('numCites2Norm'), areaSizeScaleNormQuantitative))
    numCites2AreaSize: number;
    @Operand<number>(chain(access('numCites2Norm'), fontSizeScaleNormQuantitative))
    numCites2FontSize: number;
    @Operand<string>(chain(access('numCites2Norm'), colorScaleNormQuantitative))
    numCites2Color: string;
    @Operand<string>(chain(access('numCites2Norm'), colorScaleNormQuantitativeStroke))
    numCites2StrokeColor: string;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      globalStats.numCitesMax = Math.max(globalStats.numCitesMax || 0, this.numCites2);
    }
  }
  return NumCites2;
}

export function WithNumPapers1<T extends Constructor<Mappable>>(Base: T) {
  class NumPapers1 extends Base {
    numPapers1: number;

    // #Papers Encodings
    @Operand<number>(norm0to100('numPapers1', 'globalStats.numPapersMax'))
    numPapers1Norm: number;
    @Operand<string>(chain(access('numPapers1'), formatNumber))
    numPapers1Label: string;
    @Operand<number>(chain(access('numPapers1Norm'), areaSizeScaleNormQuantitative))
    numPapers1AreaSize: number;
    @Operand<number>(chain(access('numPapers1Norm'), fontSizeScaleNormQuantitative))
    numPapers1FontSize: number;
    @Operand<string>(chain(access('numPapers1Norm'), colorScaleNormQuantitative))
    numPapers1Color: string;
    @Operand<string>(chain(access('numPapers1Norm'), colorScaleNormQuantitativeStroke))
    numPapers1StrokeColor: string;
    @Operand<number>(chain(access<number>('numPapers1Norm'), quantitativeTransparency))
    numPapers1Transparency: number;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      globalStats.numPapersMax = Math.max(globalStats.numPapersMax || 0, this.numPapers1);
    }
  }
  return NumPapers1;
}

export function WithNumPapers2<T extends Constructor<Mappable>>(Base: T) {
  class NumPapers2 extends Base {
    numPapers2: number;

    // #Papers Encodings
    @Operand<number>(norm0to100('numPapers2', 'globalStats.numPapersMax'))
    numPapers2Norm: number;
    @Operand<string>(chain(access('numPapers2'), formatNumber))
    numPapers2Label: string;
    @Operand<number>(chain(access('numPapers2Norm'), areaSizeScaleNormQuantitative))
    numPapers2AreaSize: number;
    @Operand<number>(chain(access('numPapers2Norm'), fontSizeScaleNormQuantitative))
    numPapers2FontSize: number;
    @Operand<string>(chain(access('numPapers2Norm'), colorScaleNormQuantitative))
    numPapers2Color: string;
    @Operand<string>(chain(access('numPapers2Norm'), colorScaleNormQuantitativeStroke))
    numPapers2StrokeColor: string;
    @Operand<number>(chain(access<number>('numPapers2Norm'), quantitativeTransparency))
    numPapers2Transparency: number;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      globalStats.numPapersMax = Math.max(globalStats.numPapersMax || 0, this.numPapers2);
    }
  }
  return NumPapers2;
}

function hIndex(cites: number[]): number {
  return cites.sort((n1, n2) => n2 - n1).filter((n, i) => n > i).length;
}

export function WithHIndex<T extends Constructor<Mappable>>(Base: T) {
  class HIndex extends Base {
    hIndex: number;
    sortedCites: number[];

    // hIndex Encodings
    @Operand<number>(norm0to100('hIndex', 'globalStats.hIndexMax'))
    hIndexNorm: number;
    @Operand<string>(chain(access('hIndex'), formatNumber))
    hIndexLabel: string;
    @Operand<number>(chain(access('hIndexNorm'), areaSizeScaleNormQuantitative))
    hIndexAreaSize: number;
    @Operand<number>(chain(access('hIndexNorm'), fontSizeScaleNormQuantitative))
    hIndexFontSize: number;
    @Operand<string>(chain(access('hIndexNorm'), colorScaleNormQuantitative))
    hIndexColor: string;
    @Operand<string>(chain(access('hIndexNorm'), colorScaleNormQuantitativeStroke))
    hIndexStrokeColor: string;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      this.sortedCites = (this.sortedCites || []).sort((n1, n2) => n2 - n1);
      this.hIndex = hIndex(this.sortedCites);
      globalStats.hIndexMax = Math.max(globalStats.hIndexMax || 0, this.hIndex);
    }
  }
  return HIndex;
}

export function WithHIndex1<T extends Constructor<Mappable>>(Base: T) {
  class HIndex1 extends Base {
    hIndex1: number;
    sortedCites1: number[];

    // hIndex Encodings
    @Operand<number>(norm0to100('hIndex1', 'globalStats.hIndexMax'))
    hIndex1Norm: number;
    @Operand<string>(chain(access('hIndex1'), formatNumber))
    hIndex1Label: string;
    @Operand<number>(chain(access('hIndex1Norm'), areaSizeScaleNormQuantitative))
    hIndex1AreaSize: number;
    @Operand<number>(chain(access('hIndex1Norm'), fontSizeScaleNormQuantitative))
    hIndex1FontSize: number;
    @Operand<string>(chain(access('hIndex1Norm'), colorScaleNormQuantitative))
    hIndex1Color: string;
    @Operand<string>(chain(access('hIndex1Norm'), colorScaleNormQuantitativeStroke))
    hIndex1StrokeColor: string;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      this.sortedCites1 = (this.sortedCites1 || []).sort((n1, n2) => n2 - n1);
      this.hIndex1 = hIndex(this.sortedCites1);
      globalStats.hIndexMax = Math.max(globalStats.hIndexMax || 0, this.hIndex1);
    }
  }
  return HIndex1;
}

export function WithHIndex2<T extends Constructor<Mappable>>(Base: T) {
  class HIndex2 extends Base {
    hIndex2: number;
    sortedCites2: number[];

    // hIndex Encodings
    @Operand<number>(norm0to100('hIndex2', 'globalStats.hIndexMax'))
    hIndex2Norm: number;
    @Operand<string>(chain(access('hIndex2'), formatNumber))
    hIndex2Label: string;
    @Operand<number>(chain(access('hIndex2Norm'), areaSizeScaleNormQuantitative))
    hIndex2AreaSize: number;
    @Operand<number>(chain(access('hIndex2Norm'), fontSizeScaleNormQuantitative))
    hIndex2FontSize: number;
    @Operand<string>(chain(access('hIndex2Norm'), colorScaleNormQuantitative))
    hIndex2Color: string;
    @Operand<string>(chain(access('hIndex2Norm'), colorScaleNormQuantitativeStroke))
    hIndex2StrokeColor: string;

    updateGlobalStats(globalStats: any) {
      super.updateGlobalStats(globalStats);
      this.sortedCites2 = (this.sortedCites2 || []).sort((n1, n2) => n2 - n1);
      this.hIndex2 = hIndex(this.sortedCites2);
      globalStats.hIndexMax = Math.max(globalStats.hIndexMax || 0, this.hIndex2);
    }
  }
  return HIndex2;
}
