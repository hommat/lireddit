import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange, ClientOptions } from 'urql';

import {
  CurrentUserDocument,
  CurrentUserQuery,
  LoginMutation,
  RegisterMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrlClient = (ssrExchange: any): ClientOptions => ({
  url: 'http://localhost:4000/graphql',
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (results, args, cache, info) => {
            betterUpdateQuery<LoginMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              results,
              () => ({ currentUser: null })
            );
          },

          login: (results, args, cache, info) => {
            betterUpdateQuery<LoginMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              results,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                }

                return { currentUser: result.login.user };
              }
            );
          },

          register: (results, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              results,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                }

                return { currentUser: result.register.user };
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: 'include',
  },
});
