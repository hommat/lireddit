import argon2 from 'argon2';
import { Repository, DeepPartial } from 'typeorm';
import { v4 } from 'uuid';

import { AppContext } from '@appTypes/app';
import { FieldError } from '@appTypes/shared';
import {
  ChangePasswordInput,
  UserResponse,
  RegisterInput,
} from '@appTypes/user';
import { FORGOT_PASSWORD_PREFIX } from '@constants/auth';
import { errorFields, errorMessages } from '@constants/errors';
import { CONFIRMATION_EMAIL_SENT_MESSAGE } from '@constants/messages';
import { CHANGE_PASSWORD_TOKEN_EXPIRE_TIME } from '@constants/time';
import { User } from '@entities/User';
import { AuthService } from '@services/AuthService';
import { EmailService } from '@services/EmailService';

export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly authService: AuthService;
  private readonly emailService: EmailService;

  constructor() {
    this.userRepository = User.getRepository();
    this.authService = new AuthService();
    this.emailService = new EmailService();
  }

  getUserEmail(user: User, ctx: AppContext): string {
    return this.authService.getSessionUserId(ctx) === user.id ? user.email : '';
  }

  getCurrentUser(ctx: AppContext) {
    const userId = this.authService.getSessionUserId(ctx);
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
        errors: [
          new FieldError(errorFields.token, errorMessages.user.TOKEN_NOT_VALID),
        ],
      };
    }

    const user = await User.findOne(+userId);
    if (!user) {
      return {
        errors: [
          new FieldError(
            errorFields.token,
            errorMessages.user.USER_NO_LONGER_EXISTS
          ),
        ],
      };
    }

    const hashPasswordPromise = argon2.hash(password);
    const deleteTokenPromise = ctx.redis.del(tokenKey);

    const [hashedPassword] = await Promise.all([
      hashPasswordPromise,
      deleteTokenPromise,
    ]);

    await User.update({ id: +userId }, { password: hashedPassword });
    this.authService.setSessionUserId(ctx, user.id);

    return { user };
  }

  async forgotPassword(email: string, ctx: AppContext): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const token = v4();
      await ctx.redis.set(
        FORGOT_PASSWORD_PREFIX + token,
        user.id,
        'ex',
        CHANGE_PASSWORD_TOKEN_EXPIRE_TIME
      );

      this.emailService.sendChangePasswordEmail(email, token);
    }

    return CONFIRMATION_EMAIL_SENT_MESSAGE;
  }

  async register(input: RegisterInput, ctx: AppContext): Promise<UserResponse> {
    const { username, password, email } = input;

    const userWithUsername = await this.userRepository.findOne({
      where: { username },
    });

    if (userWithUsername) {
      return {
        errors: [
          new FieldError(
            errorFields.USERNAME,
            errorMessages.user.USERNAME_TAKEN
          ),
        ],
      };
    }

    const userWithEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (userWithEmail) {
      return {
        errors: [
          new FieldError(errorFields.EMAIL, errorMessages.user.EMAIL_TAKEN),
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    const newUserData: DeepPartial<User> = {
      username,
      email,
      password: hashedPassword,
    };

    const user = await this.userRepository.create(newUserData).save();
    this.authService.setSessionUserId(ctx, user.id);

    return { user };
  }
}
