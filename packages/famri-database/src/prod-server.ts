/* eslint-disable global-require,no-console,no-new */
import express from 'express';
import morgan from 'morgan';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import * as path from 'path';
import cors from 'cors';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';
import { GraphQLError, execute, subscribe } from 'graphql';
import { formatError as apolloFormatError, createError } from 'apollo-errors';
import { schema } from './graphql/schema';
import { createServerContext } from './graphql/server-context';

// Constants
const PORT = process.env.PORT || 8080;
// if you're not using docker-compose for local development, this will default to 8080
// to prevent non-root permission problems with 80. Dockerfile is set to make this 80
// because containers don't have that issue :)

const DEFAULT_ENDPOINT_URL = '/graphql/';
const ENDPOINT_URL = process.env.ENDPOINT_URL || DEFAULT_ENDPOINT_URL;

const ADAPTER = 'websql';
const DB_DUMP = 'db-dump.json';
const DB_SQLITE = 'db/famri';

const app = express();

app.use(morgan('common'));

//
// Top level error
//
// Unless any other error is matched we will send this for
// all error conditions.
//
const UnknownError = createError('UnknownError', {
  message: 'An unknown error has occurred.  Please try again later',
});

const formatError = (error) => {
  //
  // Log raw errors to the server console
  //
  console.log(error);
  console.log('----^ ^ ^ ^ ^ error ^ ^ ^ ^ ^----');

  //
  // Prepare a formatted error for the client, so that we
  // don't expose any internals about the API or database connection
  // to the client making the GraphQL query.
  //
  let formattedError = apolloFormatError(error);
  if (formattedError instanceof GraphQLError) {
    formattedError = apolloFormatError(new UnknownError({
      data: {
        originalMessage: formattedError.message,
        originalError: formattedError.name,
      },
    }));
  }

  return formattedError;
};

const context = createServerContext(ADAPTER, DB_DUMP, DB_SQLITE);

//
// Setup GraphQl endpoint
//
// Use Express to listen for all GraphQL queries at
// the '/graphql' path.
//
// Load the schema and context for each GraphQL request.
//
app.use('/graphql', bodyParser.json(), graphqlExpress((request, response) => {
  return {
    schema,
    context,
    formatError,
    /*
    debug: true,
    tracing: true,
    cacheControl: true
    */
  };
}));

app.get('/healthz', function (req, res) {
	// do app logic here to determine if app is truly healthy
	// you should return 200 if healthy, and anything else will fail
	// if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send('I am happy and healthy\n');
});

// Client compiled project path
app.use('/', express.static('client'));

// Start the GraphQL server and populate DB with seed data if empty
const server = createServer(app);
server.listen(PORT, () => {
  console.log('Webserver is ready');
});

//
// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
// this also won't work on using npm start since:
// https://github.com/npm/npm/issues/4603
// https://github.com/npm/npm/pull/10868
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
// if you want to use npm then start with `docker run --init` to help, but I still don't think it's
// a graceful shutdown of node process
//

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint () {
	console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm () {
  console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
  shutdown();
})

// shut down server
function shutdown() {
  server.close(function onServerClosed (err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
		}
		process.exit();
  })
}
//
// need above in docker container to properly exit
//
