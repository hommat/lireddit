import { Resolver, Arg, Mutation, Ctx, UseMiddleware } from 'type-graphql';

import { AppContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { Vote } from '../entities/Vote';
import { VoteInput } from '../types/vote';
import { VoteService } from '../services/VoteService';

@Resolver(Vote)
export class VoteResolver {
  private readonly voteService: VoteService;

  constructor() {
    this.voteService = new VoteService();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('voteInput', () => VoteInput) input: VoteInput,
    @Ctx() ctx: AppContext
  ): Promise<boolean> {
    return this.voteService.vote(input, ctx);
  }
}
