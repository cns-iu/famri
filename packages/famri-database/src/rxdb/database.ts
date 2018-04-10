import RxDB from 'rxdb';
import { RxDocument } from 'rxdb';
import RxDBValidateModule from 'rxdb/plugins/validate';
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check';

import * as IDBAdapter from 'pouchdb-adapter-idb';
import * as WebSQLAdapter from 'pouchdb-adapter-node-websql';
import * as MemoryAdapter from 'pouchdb-adapter-memory';

import { RxDatabase } from './rxdb-types.d';
import { PublicationSchema } from './publication.schema';

export class DatabaseService {
  private static dbPromise: Promise<RxDatabase> = null;

  collections: any[] = [
    { name: 'publication', schema: PublicationSchema }
  ];

  adapters: any = {
    'idb': IDBAdapter,
    'websql': WebSQLAdapter,
    'memory': MemoryAdapter
  };

  constructor(private production?: boolean, private adapter: string = 'memory', private rxdbOptions: any = {}) { }

  get(initializer?: (db: RxDatabase) => Promise<any>): Promise<RxDatabase> {
    if (!DatabaseService.dbPromise) {
      DatabaseService.dbPromise = this._create(initializer);
    }
    return DatabaseService.dbPromise;
  }

  public async initializeCollection(collection: string, data: any[]) {
    const db = await this.get();
    const coll = db[collection];
    if ((await coll.find().limit(1).exec()).length === 0) {
      await Promise.all(data.map((item) => coll.insert(item)));
    }
    const results = (await coll.find().exec()).length;
    this.log(`${collection}: ${results}`);
  }

  private async initialize(db: RxDatabase) {
    // Do nothing...
  }

  private async _create(initializer?: (db: RxDatabase) => Promise<any>): Promise<RxDatabase> {
    this.setupPlugins();

    this.log('DatabaseService: creating database');
    const db: RxDatabase = await RxDB.create(Object.assign({
      name: 'famri',
      adapter: this.adapter
    }, this.rxdbOptions));
    this.log('DatabaseService: creating collections');
    await Promise.all(this.collections.map(colData => db.collection(colData)));
    await this.initialize(db);
    if (initializer) {
      await initializer(db);
    }

    return db;
  }

  private setupPlugins() {
    if (!this.production) {
      // schema-checks should be used in dev-mode only
      RxDB.plugin(RxDBSchemaCheckModule);
    }
    RxDB.plugin(RxDBValidateModule);
    RxDB.plugin(this.adapters[this.adapter]);
    // Always add the memory adapter
    if (this.adapter !== 'memory') {
      RxDB.plugin(MemoryAdapter);
    }

    RxDB.QueryChangeDetector.enable(true);
    if (!this.production) {
      RxDB.QueryChangeDetector.enableDebugging();
    }
  }

  private log(message: string) {
    if (!this.production) {
      console.log(message);
    }
  }
}
