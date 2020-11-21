import 'reflect-metadata';
import { __prod__, COOKIE_NAME } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import { PostResolver } from './resolvers/post';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { VoteResolver } from './resolvers/vote';
import { Post } from './entities/Post';
import { Vote } from './entities/Vote';
import { User } from './entities/User';
import { createUserLoader } from './utils/createUserLoader';
import { createVoteLoader } from './utils/createVoteLoader';

let RedisStore = connectRedis(session);
let redis = new Redis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

const main = async () => {
  await createConnection({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    logging: !__prod__,
    synchronize: !__prod__,
    entities: [Post, Vote, User],
  });

  const app = express();

  app.use(
    cors({
      origin: [process.env.WEB_HOST_CLIENT!, process.env.WEB_HOST_SERVER!],
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET!,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, VoteResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      voteLoader: createVoteLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    if (!__prod__) {
      console.log('server started on localhost:4000');
    }
  });
};

main();
