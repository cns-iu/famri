import { createWorker, handleSubscriptions } from 'apollo-link-webworker';

import { schema } from './graphql/schema';
import { pubsub } from './graphql/subscriptions';
import { context } from './graphql/client-context';

createWorker({
  schema,
  context
});

self.onmessage = message => handleSubscriptions({
  self,
  message,
  schema,
  context,
  pubsub,
});
