import { Resolver, Ctx, Arg, Mutation, Query, FieldResolver, Root } from 'type-graphql';

import { AppContext } from '@appTypes/app';
import { UserResponse, ChangePasswordInput, RegisterInput } from '@appTypes/user';
import { User } from '@entities/User';
import { UserService } from '@services/UserService';

@Resolver(User)
export class UserResolver {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() ctx: AppContext): string {
    return this.userService.getUserEmail(user, ctx);
  }

  @Query(() => User, { nullable: true })
  currentUser(@Ctx() ctx: AppContext) {
    return this.userService.getCurrentUser(ctx);
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('changePasswordInput') input: ChangePasswordInput,
    @Ctx() ctx: AppContext
  ): Promise<UserResponse> {
    return this.userService.changePassword(input, ctx);
  }

  @Mutation(() => String)
  async forgotPassword(@Arg('email') email: string, @Ctx() ctx: AppContext): Promise<string> {
    return this.userService.forgotPassword(email, ctx);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('registerInput') input: RegisterInput,
    @Ctx() ctx: AppContext
  ): Promise<UserResponse> {
    return this.userService.register(input, ctx);
  }
}
