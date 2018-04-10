const fs = require('fs');
import { DatabaseService } from '../rxdb/database';

import { DB_JSON, DB_DUMP } from './options';

function readJSON(inputFile: string): any {
  return JSON.parse(fs.readFileSync(inputFile));
}

const publications = readJSON(DB_JSON);

console.log(publications.length);

function writeJSON(outputFile: string, obj: any) {
  fs.writeFileSync(outputFile, JSON.stringify(obj, null, 2), 'utf8');
}

async function createDBDump(): Promise<any> {
  const database = new DatabaseService(false, 'memory');
  const db = await database.get();

  await database.initializeCollection('publication', publications);

  const dump = await db.dump();
  return dump;
}

createDBDump().then((dump) => {
  writeJSON(DB_DUMP, dump);
  process.exit();
});
