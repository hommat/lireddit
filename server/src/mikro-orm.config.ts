import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities/Post';
import { __prod__ } from './constants';
import path from 'path';

type MikroOrmConfig = Parameters<typeof MikroORM.init>[0];

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: 'lireddit',
  user: 'user',
  password: 'password',
  type: 'postgresql',
  debug: !__prod__,
} as MikroOrmConfig;
