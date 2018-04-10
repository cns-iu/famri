import { Map } from 'immutable';
import * as libXLSX from 'xlsx';

import { Operator } from '@ngx-dino/core/operators';
import '@ngx-dino/core/src/operators/add/static/access';
import '@ngx-dino/core/src/operators/add/static/combine';
import '@ngx-dino/core/src/operators/add/method/map';


// Types and interfaces
export interface NameTableValue {
  id: number;
}

export interface IdTableValue {
  subd_id: number;
  // name: string;
  weight: number;
}


// Constants
const mapperFilePath = '../../raw-data/UCSDmapDataTables.xlsx';

const nameTableName = 'Table 7';
const nameTableStart = 'A13';
const nameTableExtractor = Operator.combine<any, [string, NameTableValue]>([
  Operator.access('journal_name').map(normalizeName),
  {
    id: Operator.access('journ_id').map(Number)
  }
]);

const idTableName = 'Table 4';
const idTableStart = 'A13';
const idTableExtractor = Operator.combine<any, [number, IdTableValue]>([
  Operator.access('journ_id').map(Number),
  {
    subd_id: Operator.access('subd_id').map(Number),
    // name: Operator.access('formal_name'),
    weight: Operator.access('jfraction').map(Number)
  }
]);


// Lazily initialized
let rawNameTable: libXLSX.WorkSheet;
let nameTable: Map<string, NameTableValue>;

let rawIdTable: libXLSX.WorkSheet;
let idTable: Map<number, IdTableValue[]>;


// Loading and parsing
function loadRawTables(): void {
  const workbook = libXLSX.readFile(mapperFilePath);

  rawNameTable = workbook.Sheets[nameTableName];
  rawIdTable = workbook.Sheets[idTableName];
}

function loadNameTable(): void {
  if (nameTable !== undefined) {
    return;
  } else if (rawNameTable === undefined) {
    loadRawTables();
  }

  nameTable = parse(rawNameTable, nameTableStart, nameTableExtractor);
  rawNameTable = undefined;
}

function loadIdTable(): void {
  if (idTable !== undefined) {
    return;
  } else if (rawIdTable === undefined) {
    loadRawTables();
  }

  idTable = parse2(rawIdTable, idTableStart, idTableExtractor);
  rawIdTable = undefined;
}

function parse<K, V>(
  sheet: libXLSX.WorkSheet, start: string, extractor: Operator<any, [K, V]>
): Map<K, V> {
  const range = sheet['!ref'].replace('A1', start);
  const jsonData = libXLSX.utils.sheet_to_json(sheet, {range});

  return Map(jsonData.map(extractor.getter));
}

function parse2<K, V>(
  sheet: libXLSX.WorkSheet, start: string, extractor: Operator<any, [K, V]>
): Map<K, V[]> {
  const range = sheet['!ref'].replace('A1', start);
  const jsonData = libXLSX.utils.sheet_to_json(sheet, {range});

  return Map<K, V[]>().withMutations((map) => {
    jsonData.map(extractor.getter).forEach(([key, value]) => {
      map.update(key, (values = []) => {
        values.push(value);
        return values;
      });
    });
  });
}


// Exported api
export function normalizeName(name: string): string {
  return String(name).replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
    .split(/\s/).filter((str) => str.length !== 0).join(' ').toLowerCase();
}

export function getNameTable(): Map<string, NameTableValue> {
  loadNameTable();
  return nameTable;
}

export function getIdTable(): Map<number, IdTableValue[]> {
  loadIdTable();
  return idTable;
}
