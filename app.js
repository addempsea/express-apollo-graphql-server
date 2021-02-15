import { print } from 'graphql';
import express, { json, Router } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from './graphql';
import { auth, loginUser, errorHandler } from './utils/helpers';
import logger from './logger';

global.logger = logger;

// const myPlugin = {
//   // Fires whenever a GraphQL request is received from a client.
//   requestDidStart(requestContext) {
//     console.log('Request started! Query:\n' + requestContext.request.query);

//     return {
//       // Fires whenever Apollo Server will parse a GraphQL
//       // request to create its associated document AST.
//       parsingDidStart(requestContext) {
//         console.log('Parsing started!');
//       },

//       // Fires whenever Apollo Server will validate a
//       // request's document AST against your GraphQL schema.
//       validationDidStart(requestContext) {
//         console.log('Validation started!');
//       }
//     };
//   }
// };

class BasicLogging {
  requestDidStart({ queryString, parsedQuery, variables }) {
    const query = queryString || print(parsedQuery);
    logger.info(query);
    logger.info(variables);
  }

  willSendResponse({ graphqlResponse }) {
    logger.info(JSON.stringify(graphqlResponse, null, 2));
  }
}
const app = express();
app.use(json());
app.use(cors());
const router = Router();

router.get('/', (req, res) =>
  res.status(200).json({ message: 'Welcome to Graphql' })
);

const loginRoute = router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password);
    if (token) {
      res.status(200).json({ msg: 'welcome', token });
    }
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
});
app.use('/login', loginRoute);
// app.use('/', auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // plugins: [myPlugin],
  // extensions: [() => new BasicLogging()],
  // context: ({ req }) => {
  //   const user = req.user;
  //   return user;
  // },
  formatError: (err) => {
    const error = errorHandler(err);
    return error;
  }
});
server.applyMiddleware({ app });
// const httpServer = createServer(app);
// server.installSubscriptionHandlers(httpServer);

app.use(morgan('dev', { stream: logger.stream }));

const uri = `mongodb://localhost:27017/apollo`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose
  .connect(uri, options)
  .then(() => logger.info('🚀🚀🚀 Db connected'))
  .catch((error) => {
    throw error;
  });

console.log(server);

app.listen({ port: 3000 }, () => {
  logger.info(
    `🚀 Server ready at http://localhost:${3000}${server.graphqlPath}`
  );
  logger.info(
    `🚀🚀 Subscriptions ready at ws://localhost:${3000}${
      server.subscriptionsPath
    }`
  );
});
