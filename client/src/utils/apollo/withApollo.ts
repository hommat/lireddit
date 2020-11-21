import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';
import { NextPageContext } from 'next';

import { PaginatedPosts } from '@generated/graphql';

const createClient = (ctx?: NextPageContext) =>
  new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    headers: {
      cookie: ctx?.req?.headers.cookie || '',
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge: (
                current: PaginatedPosts | undefined,
                next: PaginatedPosts
              ): PaginatedPosts => ({
                ...next,
                posts: [...(current?.posts || []), ...next.posts],
              }),
            },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
