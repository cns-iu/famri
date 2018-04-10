const fs = require('fs');
import { DatabaseService } from '../rxdb/database';

import { DB_DUMP, DB_SQLITE } from './options';

function readJSON(inputFile: string): any {
  return JSON.parse(fs.readFileSync(inputFile));
}

const dump = readJSON(DB_DUMP);

async function importDBDump(): Promise<any> {
  const database = new DatabaseService(false, 'websql', {name: DB_SQLITE});
  const db = await database.get();
  const hasResults = !!(await db.publication.findOne().exec());
  if (!hasResults) {
    await db.importDump(dump);
  }
  return db;
}

importDBDump().then(() => {
  console.log('DB Imported');
  process.exit();
});
