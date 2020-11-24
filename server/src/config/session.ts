import { SessionOptions, Store } from 'express-session';

import { COOKIE_NAME } from '@constants/auth';
import { COOKIE_EXPIRE_TIME } from '@constants/time';
import { __prod__ } from '@constants/utils';

export const createSessionConfig = (store: Store): SessionOptions => ({
  name: COOKIE_NAME,
  store,
  cookie: {
    maxAge: COOKIE_EXPIRE_TIME,
    httpOnly: true,
    sameSite: 'lax',
    secure: __prod__,
  },
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET!,
  resave: false,
});
