export const fs = require('fs');
import * as XLSX from 'xlsx';
import { safeDump, safeLoad } from 'js-yaml';
import { Graph } from 'graphology';
import gexf from 'graphology-gexf/node';


export function readJSON(inputFile: string): any {
  return JSON.parse(fs.readFileSync(inputFile));
}
export function writeJSON(outputFile: string, obj: any) {
  fs.writeFileSync(outputFile, JSON.stringify(obj, null, 2), 'utf8');
}

export function readYAML(inputFile: string): any {
  return safeLoad(readFile(inputFile));
}
export function writeYAML(outputFile: string, obj: any) {
  fs.writeFileSync(outputFile, safeDump(obj, { skipInvalid: true }), 'utf8');
}

export function readXLSX(inputFile: string, sheetName?: string): any[] {
  const wb = XLSX.readFile(inputFile);
  sheetName = sheetName || wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws);
  return data;
}
export function readFile(inputFile: string): string {
  return fs.readFileSync(inputFile, 'utf8');
}
export function readGexfFile(gexfFile: string): Graph {
  return gexf.parse(Graph, readFile(gexfFile));
}
