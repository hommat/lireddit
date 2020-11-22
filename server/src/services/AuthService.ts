import argon2 from 'argon2';
import { Repository } from 'typeorm';

import { User } from '../entities/User';
import { AppContext } from '../types';
import { UserResponse, LoginInput } from '../types/user';
import { COOKIE_NAME } from '../constants';

export class AuthService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = User.getRepository();
  }

  async login(input: LoginInput, ctx: AppContext): Promise<UserResponse> {
    const { username, password } = input;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return {
        errors: [
          { field: 'credentials', message: 'Wrong username or password' },
        ],
      };
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return {
        errors: [
          { field: 'credentials', message: 'Wrong username or password' },
        ],
      };
    }

    this.setSessionUserId(ctx, user.id);

    return { user };
  }

  logout({ res, req }: AppContext): Promise<unknown> {
    res.clearCookie(COOKIE_NAME);

    return new Promise((resolve) =>
      req.session.destroy((err) => resolve(!err))
    );
  }

  getSessionUserId(ctx: AppContext): number | undefined {
    return ctx.req.session.userId;
  }

  setSessionUserId(ctx: AppContext, userId: number | undefined) {
    ctx.req.session.userId = userId;
  }
}
