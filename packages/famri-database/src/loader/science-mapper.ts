import { Operator } from '@ngx-dino/core/operators';
import '@ngx-dino/core/src/operators/add/static/lookup';
import '@ngx-dino/core/src/operators/add/static/map';
import '@ngx-dino/core/src/operators/add/method/lookup';

import { getNameTable, getIdTable, normalizeName } from './science-mapper-data';


export const journalLookup = Operator.map(normalizeName).lookup(getNameTable());
export const disciplineLookup = Operator.lookup(getIdTable());
