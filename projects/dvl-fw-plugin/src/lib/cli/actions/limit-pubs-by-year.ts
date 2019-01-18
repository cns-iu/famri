import { readFileSync } from 'fs';
import { readJSON, writeJSON } from '../utils';
import * as csvParse from 'csv-parse/lib/sync';

export function limitPubsByYear(inPubs: string, startYear: number, endYear: number, outPubs: string) {
  startYear = Number(startYear);
  endYear = Number(endYear);

  const pubs: any[] = readJSON(inPubs);
  const newPubs = pubs.filter(pub => {
    const year = isFinite(Number(pub.year)) ? Number(pub.year) : 0;
    return year >= startYear && year <= endYear;
  });

  writeJSON(outPubs, newPubs);
  console.log(pubs.length, newPubs.length, startYear, endYear);
}
