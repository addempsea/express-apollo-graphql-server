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
import dotenv from 'dotenv';

dotenv.config()

global.logger = logger;
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
  formatError: (err) => {
    const error = errorHandler(err);
    return error;
  }
});
server.applyMiddleware({ app });
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

app.use(morgan('dev', { stream: logger.stream }));

const uri = `mongodb+srv://admin:1Password-@cluster0.5nms6.mongodb.net/apollo?retryWrites=true&w=majority`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose
  .connect(uri, options)
  .then(() => logger.info('🚀🚀🚀 Db connected'))
  .catch((error) => {
    throw error;
  });

httpServer.listen({ port: process.env.PORT || 3000 }, () => {
  logger.info(
    `🚀 Server ready at http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`
  );
  logger.info(
    `🚀🚀 Subscriptions ready at ws://localhost:${process.env.PORT || 3000}${
      server.subscriptionsPath
    }`
  );
});
