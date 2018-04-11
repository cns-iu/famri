import './rxjs-operators.ts';

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlConnectionModule } from './graphql-connection.module';
import { DatabaseService } from 'famri-database';

@NgModule({
  imports: [
    CommonModule,
    // GraphqlConnectionModule
  ],
  declarations: [],
  providers: [DatabaseService]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule, databaseService: DatabaseService) {
    console.log(databaseService);

    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
