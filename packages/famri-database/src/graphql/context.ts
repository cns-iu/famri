import { RxDatabase } from '../rxdb/rxdb-types';
import { DatabaseService } from '../rxdb/database';

export class GraphQLContext {
  constructor(public database: DatabaseService, public db?: RxDatabase) {
    if (!db) {
      database.get().then((dbInstance) => { this.db = dbInstance; });
    }
  }
}
