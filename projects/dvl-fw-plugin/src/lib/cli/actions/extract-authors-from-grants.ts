

import * as csvStringify from 'csv-stringify/lib/sync';
import { fs, readXLSX } from '../utils';


export async function extractAuthorsFromGrants(grantsFile: string, authorsFile: string) {
  const grants = readXLSX(grantsFile);

  const authors = [];
  for (const grant of grants) {
    const names = ['EndNote author list_1', 'EndNote author list_2', 'EndNote author list_3']
      .map(field => (grant[field] || '').trim()).filter(s => !!s);

    for (const name of names) {
      authors.push({name, remapped: names[0]});
    }
  }

  const csvString = csvStringify(authors, {header: true, columns: ['name', 'remapped']});
  fs.writeFileSync(authorsFile, csvString, 'utf8');
}
