import { Redis } from 'ioredis';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';

import { AppContext } from '@appTypes/app';
import { __prod__ } from '@constants/utils';
import { AuthResolver } from '@resolvers/AuthResolver';
import { PostResolver } from '@resolvers/PostResolver';
import { UserResolver } from '@resolvers/UserResolver';
import { VoteResolver } from '@resolvers/VoteResolver';
import { createUserLoader } from '@loaders/user';
import { createVoteLoader } from '@loaders/vote';

export const createApolloServer = async (
  redis: Redis
): Promise<ApolloServer> => {
  return new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, VoteResolver, AuthResolver],
      validate: false,
    }),
    context: ({ req, res }): AppContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      voteLoader: createVoteLoader(),
    }),
  });
};
