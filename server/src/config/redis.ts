import Redis from 'ioredis';
import session from 'express-session';
import libConnectRedis from 'connect-redis';

export const connectRedis = () => {
  const RedisStore = libConnectRedis(session);
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });

  return {
    redis,
    redisStore: new RedisStore({ client: redis, disableTouch: true }),
  };
};
