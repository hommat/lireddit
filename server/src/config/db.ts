import { createConnection } from 'typeorm';

import { __prod__ } from '@constants/utils';
import { Post } from '@entities/Post';
import { User } from '@entities/User';
import { Vote } from '@entities/Vote';

export const connectDB = async () => {
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
};
