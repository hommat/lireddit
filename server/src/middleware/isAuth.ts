import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server-express';

import { AppContext } from '@appTypes/app';
import { errorMessages } from '@constants/errors';

export const isAuth: MiddlewareFn<AppContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new AuthenticationError(errorMessages.auth.NOT_LOGGED_IN);
  }

  return next();
};
