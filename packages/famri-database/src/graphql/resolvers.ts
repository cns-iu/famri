import { pubsub } from './subscriptions';

import { getPublications, getSubdisciplines, getDistinct } from '../rxdb/queries';

export const resolvers: any = {
  Query: {
    'getPublications': (obj, args, context, info) => {
      return getPublications(context.database, args.filter);
    },
    'getSubdisciplines': (obj, args, context, info) => {
      return getSubdisciplines(context.database, args.filter);
    },
    'getDistinct': (obj, args, context, info) => {
      return getDistinct(context.database, args.fieldName, args.filter);
    }
  }
};
