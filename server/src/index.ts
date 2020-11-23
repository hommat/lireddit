import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import cors from 'cors';

import { __prod__ } from './constants/utils';
import {
  connectRedis,
  createSessionConfig,
  connectDB,
  createCorsConfig,
  createApolloServer,
} from './config';

const main = async () => {
  await connectDB();
  const { redis, redisStore } = connectRedis();

  const app = express();
  app.use(cors(createCorsConfig()));
  app.use(session(createSessionConfig(redisStore)));

  const apolloServer = await createApolloServer(redis);
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    if (!__prod__) {
      console.log('server started on localhost:4000');
    }
  });
};

main();
