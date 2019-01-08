

import * as csvStringify from 'csv-stringify/lib/sync';
import { fs, readXLSX } from '../utils';


export async function extractAuthorsFromGrants(grantsFile: string, authorsFile: string) {
  const grants = readXLSX(grantsFile);

  const authors = [];
  for (const grant of grants) {
    const lastName = grant['PI_Last_Name'].trim();
    const firstName = grant['PI_First_ Name'].trim();
    const name = `${lastName}, ${firstName[0]}.`;

    authors.push({
      name, firstName, lastName
    });
  }

  const csvString = csvStringify(authors, { header: true, columns: ['name', 'firstName', 'lastName']});
  fs.writeFileSync(authorsFile, csvString, 'utf8');
}
