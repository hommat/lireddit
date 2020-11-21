import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';
import { NextPageContext } from 'next';

import { PaginatedPosts } from '@generated/graphql';
import { isServer } from '@utils/isServer';

const API_URL = isServer()
  ? process.env.GRAPHQL_SERVER_API_URL
  : process.env.NEXT_PUBLIC_GRAPHQL_CLIENT_API_URL;

const createClient = (ctx?: NextPageContext) =>
  new ApolloClient({
    uri: API_URL,
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
