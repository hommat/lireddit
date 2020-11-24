import { ApolloCache } from '@apollo/client';

import { CurrentUserQuery, CurrentUserDocument, User } from '@generated/graphql';

type NewCurrentUser = Pick<User, 'id' | 'username'> | null | undefined;

export const clearCachePosts = <T>(cache: ApolloCache<T>) => {
  cache.evict({ fieldName: 'posts:{}' });
};

export const setCacheCurrentUser = <T>(cache: ApolloCache<T>, newCurrentUser: NewCurrentUser) => {
  cache.writeQuery<CurrentUserQuery>({
    query: CurrentUserDocument,
    data: {
      __typename: 'Query',
      currentUser: newCurrentUser,
    },
  });
};
