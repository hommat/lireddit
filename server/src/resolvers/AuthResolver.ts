import { Resolver, Ctx, Arg, Mutation } from 'type-graphql';

import { AppContext } from '@appTypes/app';
import { UserResponse, LoginInput } from '@appTypes/user';
import { AuthService } from '@services/AuthService';

@Resolver()
export class AuthResolver {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  @Mutation(() => UserResponse)
  async login(@Arg('loginInput') input: LoginInput, @Ctx() ctx: AppContext): Promise<UserResponse> {
    return this.authService.login(input, ctx);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() ctx: AppContext) {
    return this.authService.logout(ctx);
  }
}
