const fs = require('fs');
import { DatabaseService } from '../rxdb/database';
import { GraphQLContext } from './context';

import { DB_DUMP, DB_SQLITE } from '../loader/options';

function readJSON(inputFile: string): any {
  return JSON.parse(fs.readFileSync(inputFile));
}

async function importDBDump(database: DatabaseService, dumpFile: string): Promise<any> {
  const dump = readJSON(dumpFile);

  const db = await database.get(async (db) => {
    const hasResults = !!(await db.publication.findOne().exec());
    if (!hasResults) {
      console.log("Importing dump");
      await db.importDump(dump)
    }
  });
  return db;
}

export function createServerContext(adapter = 'websql', dbDumpFile = DB_DUMP, sqliteFile = DB_SQLITE): GraphQLContext {
  console.log(adapter, dbDumpFile, sqliteFile);
  const rxdbOptions: any = {};
  if (adapter === 'websql' && sqliteFile) {
    rxdbOptions['name'] = sqliteFile;
  }
  const database = new DatabaseService(false, adapter, rxdbOptions);

  importDBDump(database, dbDumpFile).then(() => {
    console.log('DB Loaded');
  });
  return new GraphQLContext(database);
}

// export const context = createServerContext();
