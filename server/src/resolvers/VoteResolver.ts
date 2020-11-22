import {
  Resolver,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from 'type-graphql';
import { AppContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';
import { Vote } from '../entities/Vote';
import { PostRepository } from '../repositories/PostRepository';

@InputType()
class VoteInput {
  @Field(() => Int)
  postId: number;

  @Field(() => Int)
  value: number;
}

@Resolver(Vote)
export class VoteResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('voteInput', () => VoteInput) { postId, value }: VoteInput,
    @Ctx() { req }: AppContext
  ): Promise<boolean> {
    //@todo validation
    const realValue = value === 1 ? 1 : -1;

    const { userId } = req.session;
    const vote = await Vote.findOne({ where: { postId, userId } });

    // Change vote
    if (vote && vote.value !== realValue) {
      await getConnection().transaction(async (em) => {
        const updateVotePromise = em
          .getRepository(Vote)
          .update({ postId, userId }, { value: realValue });

        const updatePostPromise = em
          .getCustomRepository(PostRepository)
          .addPoints(postId, 2 * realValue);

        await Promise.all([updateVotePromise, updatePostPromise]);
      });
      //create Vote
    } else if (!vote) {
      await getConnection().transaction(async (em) => {
        const createVotePromise = em
          .getRepository(Vote)
          .insert({ postId, userId, value: realValue });

        const updatePostPromise = em
          .getCustomRepository(PostRepository)
          .addPoints(postId, realValue);

        await Promise.all([createVotePromise, updatePostPromise]);
      });
    } else {
      return false;
    }

    return true;
  }
}
