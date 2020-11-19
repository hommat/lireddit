import DataLoader from 'dataloader';
import { User } from '../entities/User';

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const usersRecord: Record<number, User> = {};
    users.forEach((user) => {
      usersRecord[user.id] = user;
    });

    return userIds.map((userId) => usersRecord[userId]);
  });
