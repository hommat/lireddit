import {
  withUrqlClient as defaultWithUrqlClient,
  WithUrqlClientOptions,
} from 'next-urql';

import { createUrlClient } from './createUrqlClient';

export const withUrqlClient = (options?: WithUrqlClientOptions) => {
  return defaultWithUrqlClient(createUrlClient, options);
};
