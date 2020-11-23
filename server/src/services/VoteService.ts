import { getConnection, Connection } from 'typeorm';

import { Vote } from '../entities/Vote';
import { AppContext } from '../types';
import { VoteInput } from '../types/vote';
import { PostRepository } from '../repositories/PostRepository';
import { AuthService } from './AuthService';

export class VoteService {
  private readonly authService: AuthService;
  private readonly connection: Connection;

  constructor() {
    this.authService = new AuthService();
    this.connection = getConnection();
  }

  async vote(input: VoteInput, ctx: AppContext): Promise<boolean> {
    const { postId, value } = input;
    const realValue = value === 1 ? 1 : -1;

    const userId = this.authService.getSessionUserId(ctx)!;
    const vote = await Vote.findOne({ where: { postId, userId } });

    if (vote && vote.value !== realValue) {
      await this.changeVote(postId, userId, realValue);
    } else if (!vote) {
      await this.makeVote(postId, userId, value);
    } else {
      return false;
    }

    return true;
  }

  private async changeVote(postId: number, userId: number, value: number) {
    await this.connection.transaction(async (em) => {
      const updateVotePromise = em
        .getRepository(Vote)
        .update({ postId, userId }, { value });

      const updatePostPromise = em
        .getCustomRepository(PostRepository)
        .addPoints(postId, 2 * value);

      await Promise.all([updateVotePromise, updatePostPromise]);
    });
  }

  private async makeVote(postId: number, userId: number, value: number) {
    await this.connection.transaction(async (em) => {
      const createVotePromise = em
        .getRepository(Vote)
        .insert({ postId, userId, value });

      const updatePostPromise = em
        .getCustomRepository(PostRepository)
        .addPoints(postId, value);

      await Promise.all([createVotePromise, updatePostPromise]);
    });
  }
}
