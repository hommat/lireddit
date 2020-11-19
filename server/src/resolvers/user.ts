import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
  FieldResolver,
  Root,
} from 'type-graphql';
import { MyContext } from 'src/types';
import { User } from '../entities/User';
import argon2 from 'argon2';
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from '../constants';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { getConnection } from 'typeorm';

@InputType()
class LoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
class RegisterInput extends LoginInput {
  @Field()
  email: string;
}

@InputType()
class ChangePasswordInput {
  @Field()
  password: string;

  @Field()
  token: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() { email, id }: User, @Ctx() { req }: MyContext): string {
    if ((req.session as any).userId === id) {
      return email;
    }

    return '';
  }

  @Query(() => User, { nullable: true })
  currentUser(@Ctx() { req }: MyContext) {
    const { userId } = req.session as any;
    if (!userId) {
      return null;
    }

    return User.findOne(userId);
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('changePasswordInput') { token, password }: ChangePasswordInput,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    const tokenKey = FORGOT_PASSWORD_PREFIX + token;

    let userId = await redis.get(tokenKey);
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
    const deleteTokenPromise = redis.del(tokenKey);

    const [hashedPassword] = await Promise.all([
      hashPasswordPromise,
      deleteTokenPromise,
    ]);

    await User.update({ id: +userId }, { password: hashedPassword });
    (req.session as any).userId = user.id;

    return { user };
  }

  @Mutation(() => String)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ): Promise<string> {
    const user = await User.findOne({ where: { email } });

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

  @Mutation(() => UserResponse)
  async register(
    @Arg('registerInput') { username, password, email }: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(password);
    let user;

    try {
      user = await User.create({
        username,
        email,
        password: hashedPassword,
      }).save();
    } catch (e) {
      return {
        errors: [
          { field: 'username', message: 'Username or email already exists' },
        ],
      };
    }

    (req.session as any).userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('loginInput') { username, password }: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
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

    (req.session as any).userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    res.clearCookie(COOKIE_NAME);

    return new Promise((resolve) =>
      req.session.destroy((err) => resolve(!err))
    );
  }
}
