import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
} from 'type-graphql';
import { MyContext } from 'src/types';
import { User } from '../entities/User';
import argon2 from 'argon2';
import { COOKIE_NAME } from '../constants';

@InputType()
class CredentialsInput {
  @Field()
  username: string;

  @Field()
  password: string;
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

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { em, req }: MyContext) {
    const { userId } = req.session as any;
    if (!userId) {
      return null;
    }

    const user = await em.findOne(User, { id: userId });

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('credentials') { username, password }: CredentialsInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, { username, password: hashedPassword });

    try {
      await em.persistAndFlush(user);
    } catch (e) {
      return {
        errors: [{ field: 'username', message: 'Username already exists' }],
      };
    }

    (req.session as any).userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('credentials') { username, password }: CredentialsInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username });
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
