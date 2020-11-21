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
import { Post } from '../entities/Post';
import { MyContext } from 'src/types';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';
import { Vote } from '../entities/Vote';

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
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    //@todo validation
    const realValue = value === 1 ? 1 : -1;

    const { userId } = req.session;
    const vote = await Vote.findOne({ where: { postId, userId } });

    // Change vote
    if (vote && vote.value !== realValue) {
      await getConnection().transaction(async (em) => {
        const updateVotePromise = em
          .createQueryBuilder()
          .update(Vote)
          .where('postId = :postId', { postId })
          .andWhere('userId = :userId', { userId })
          .set({ value: realValue })
          .execute();

        const updatePostPromise = em
          .createQueryBuilder()
          .update(Post)
          .where('id = :postId', { postId })
          .set({ points: () => `points + ${2 * realValue}` })
          .execute();

        await Promise.all([updateVotePromise, updatePostPromise]);
      });
      //create Vote
    } else if (!vote) {
      await getConnection().transaction(async (em) => {
        const createVotePromise = em
          .createQueryBuilder()
          .insert()
          .into(Vote)
          .values({ postId, userId, value: realValue })
          .execute();

        const updatePostPromise = em
          .createQueryBuilder()
          .update(Post)
          .where('id = :postId', { postId })
          .set({ points: () => `points + ${realValue}` })
          .execute();

        await Promise.all([createVotePromise, updatePostPromise]);
      });
    } else {
      return false;
    }

    return true;
  }
}
