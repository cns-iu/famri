import { readFileSync } from 'fs';
import { readJSON, writeJSON } from '../utils';
import * as csvParse from 'csv-parse/lib/sync';

export function limitPubs(inPubs: string, authorsFile: string, outPubs: string) {
  const pubs = readJSON(inPubs);
  const authors = csvParse(
    readFileSync(authorsFile, {encoding: 'utf8'}),
    {columns: ['name', 'firstName', 'lastName']}
  ).reduce((acc, val) => (acc[val.name] = true, acc), {});

  const newPubs = [];
  for (const pub of pubs) {
    const newAuths = pub.authors.filter((a) => authors[a.split('.')[0] + '.']);
    if (newAuths.length > 0) {
      newPubs.push(Object.assign({}, pub, {authors: newAuths}));
    }
  }

  writeJSON(outPubs, newPubs);
  console.log(pubs.length, newPubs.length, Object.keys(authors).length);
}
