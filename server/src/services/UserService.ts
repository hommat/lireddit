import argon2 from 'argon2';
import { Repository, DeepPartial } from 'typeorm';
import { v4 } from 'uuid';

import { User } from '../entities/User';
import { AppContext } from '../types';
import {
  ChangePasswordInput,
  UserResponse,
  RegisterInput,
  LoginInput,
} from '../types/user';
import { FORGOT_PASSWORD_PREFIX, COOKIE_NAME } from '../constants';
import { sendEmail } from '../utils/sendEmail';

export class UserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = User.getRepository();
  }

  getUserEmail(user: User, ctx: AppContext): string {
    return ctx.req.session.userId === user.id ? user.email : '';
  }

  getCurrentUser(ctx: AppContext) {
    const { userId } = ctx.req.session;
    if (!userId) {
      return null;
    }

    return this.userRepository.findOne(userId);
  }

  async changePassword(
    input: ChangePasswordInput,
    ctx: AppContext
  ): Promise<UserResponse> {
    const { token, password } = input;
    const tokenKey = FORGOT_PASSWORD_PREFIX + token;

    let userId = await ctx.redis.get(tokenKey);
    if (!userId) {
      return {
        errors: [{ field: 'token', message: 'Token is not valid' }],
      };
    }

    const user = await User.findOne(+userId);
    if (!user) {
      return {
        errors: [{ field: 'token', message: 'User not longer exists' }],
      };
    }

    const hashPasswordPromise = argon2.hash(password);
    const deleteTokenPromise = ctx.redis.del(tokenKey);

    const [hashedPassword] = await Promise.all([
      hashPasswordPromise,
      deleteTokenPromise,
    ]);

    await User.update({ id: +userId }, { password: hashedPassword });
    ctx.req.session.userId = user.id;

    return { user };
  }

  async forgotPassword(email: string, ctx: AppContext): Promise<string> {
    const { redis } = ctx;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const token = v4();
      await redis.set(
        FORGOT_PASSWORD_PREFIX + token,
        user.id,
        'ex',
        1000 * 60 * 60 * 24 * 3
      );

      sendEmail(
        email,
        `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
      );
    }

    return 'Confirmation email was sent, you should receive it soon if email exists';
  }

  async register(input: RegisterInput, ctx: AppContext): Promise<UserResponse> {
    const { username, password, email } = input;
    const hashedPassword = await argon2.hash(password);
    const newUserData: DeepPartial<User> = {
      username,
      email,
      password: hashedPassword,
    };

    let user;

    try {
      user = await this.userRepository.create(newUserData).save();
    } catch (e) {
      return {
        errors: [
          { field: 'username', message: 'Username or email already exists' },
        ],
      };
    }

    ctx.req.session.userId = user.id;

    return { user };
  }

  async login(input: LoginInput, ctx: AppContext): Promise<UserResponse> {
    const { username, password } = input;
    const user = await User.findOne({ where: { username } });
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

    ctx.req.session.userId = user.id;

    return { user };
  }

  logout({ res, req }: AppContext): Promise<unknown> {
    res.clearCookie(COOKIE_NAME);

    return new Promise((resolve) =>
      req.session.destroy((err) => resolve(!err))
    );
  }
}
