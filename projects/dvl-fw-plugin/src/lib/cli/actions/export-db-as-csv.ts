const fs = require('fs');
import { forOwn, isArray, isObject } from 'lodash';
import * as csvStringify from 'csv-stringify/lib/sync';

import { readYAML } from '../utils';
import { FamriDatabase } from './../../data-model/famri-database';


function flattenObject(item: any, arrayItemSep: string = '|'): any {
  const flatItem = {};
  forOwn(item, (value: any, key: string) => {
    if (key === 'Authors' || (!isArray(value) && isObject(value))) {
      return;
    } else if (isArray(value) && value.length > 0 && !isObject(value.length[1])) {
      value = value.join(arrayItemSep);
    }
    flatItem[key] = String(value).replace(new RegExp('[\r\n]+', 'g'), ' ').trim();
  });
  return flatItem;
}

function arrayToCsv(array: any[], arrayItemSep: string = '|') {
  return csvStringify(array.map((i) => flattenObject(i, arrayItemSep)), {header: true});
}

export async function exportDbAsCSV(inData: string, outBase: string) {
  const database = new FamriDatabase(readYAML(inData));
  fs.writeFileSync(`${outBase}.publications.csv`, arrayToCsv(database.publications), 'utf8');
  fs.writeFileSync(`${outBase}.authors.csv`, arrayToCsv(database.authors), 'utf8');
  fs.writeFileSync(`${outBase}.coAuthorLinks.csv`, arrayToCsv(database.coAuthorLinks), 'utf8');
}
