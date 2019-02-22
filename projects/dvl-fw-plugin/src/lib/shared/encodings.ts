export {
  areaSizeScaleNormQuantitative, fontSizeScaleNormQuantitative, strokeWidthScaleNormQuantitative,
  colorScaleNormQuantitative, colorScaleNormQuantitativeStroke, quantitativeTransparency,
  formatNumber, formatYear, defaultStyles, Transient
} from '@dvl-fw/core';

import { norm0to100 as norm0to100orig } from '@dvl-fw/core';
import { chain, map, Operator } from '@ngx-dino/core';

export function norm0to100(field: string, maxField: string, minField?: string): Operator<any, number> {
  return chain(norm0to100orig(field, maxField, minField), map(x => Math.round(x)));
}
