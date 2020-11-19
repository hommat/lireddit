import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import DataLoader from 'dataloader';
import { User } from './entities/User';

export interface MyContext {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: DataLoader<number, User>;
}
