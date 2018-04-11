import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ApolloModule, Apollo } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';

import { createClientDBLink } from 'famri-database';

import { environment } from './../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    ApolloModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [HttpLink]
})
export class GraphqlConnectionModule {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    const link = this.createLink(environment.graphqlEndpoint);
    const dataIdFromObject = result => result.id;
    const cache = new InMemoryCache({ dataIdFromObject });

    apollo.create({ link, cache });
  }

  createLink(endpoint: string): ApolloLink {
    if (endpoint === 'clientdb') {
      return createClientDBLink();
    }
    if (endpoint.startsWith('/')) {
      const url = new URL(endpoint, window.location.href);
      // url.protocol = url.protocol.replace('http', 'ws');
      endpoint = url.href;
    }
    if (endpoint.startsWith('ws:')) {
      return new WebSocketLink({
        uri: endpoint,
        options: {
          reconnect: true
        }
      });
    } else {
      return this.httpLink.create({uri: endpoint});
    }
  }
}
