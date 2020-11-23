import argon2 from 'argon2';
import { Repository } from 'typeorm';

import { User } from '../entities/User';
import { AppContext } from '../types';
import { UserResponse, LoginInput } from '../types/user';
import { COOKIE_NAME } from '../constants/auth';
import { errorMessages, errorFields } from '../constants/errors';
import { FieldError } from '../types/shared';

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
          new FieldError(
            errorFields.CREDENTIALS,
            errorMessages.auth.WRONG_USERNAME_OR_PASSWORD
          ),
        ],
      };
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return {
        errors: [
          new FieldError(
            errorFields.CREDENTIALS,
            errorMessages.auth.WRONG_USERNAME_OR_PASSWORD
          ),
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
