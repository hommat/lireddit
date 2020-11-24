import DataLoader from 'dataloader';
import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';

import { User } from '@entities/User';
import { Vote } from '@entities/Vote';
import { VoteDataLoaderInput } from '@loaders/vote';

interface AppSessionData extends Partial<SessionData> {
  userId?: number;
}

export interface AppContext {
  req: Request & { session: Session & AppSessionData };
  res: Response;
  redis: Redis;
  userLoader: DataLoader<number, User>;
  voteLoader: DataLoader<VoteDataLoaderInput, Vote>;
}
