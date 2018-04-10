import { DatabaseService } from '../rxdb/database';
import { GraphQLContext } from './context';

import { DB_DUMP_URI } from '../loader/options';

async function readJSON(uri: string): Promise<any> {
  return (await fetch(uri, { method: 'get' })).json();
}

async function importDBDump(database: DatabaseService): Promise<any> {
  const db = await database.get(async (db) => {
    const hasResults = !!(await db.publication.findOne().exec());
    if (!hasResults) {
      console.log("Importing dump");
      const dump = await readJSON(DB_DUMP_URI);
      await db.importDump(dump);
    }
  });
  return db;
}

export function createClientContext(): GraphQLContext {
  const database = new DatabaseService(false, 'idb');
  importDBDump(database).then(() => {
    console.log('DB Loaded');
  });
  return new GraphQLContext(database);
}

export const context = createClientContext();
