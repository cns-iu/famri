import { makeExecutableSchema } from 'graphql-tools';

import { schemaDef } from './schema-definition';
import { resolvers } from './resolvers';

export const schema = makeExecutableSchema({ typeDefs: schemaDef, resolvers });
