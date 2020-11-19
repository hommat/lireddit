import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  ObjectType,
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

    await getConnection().query(
      `
      START TRANSACTION;
      insert into vote ("userId", "postId", value)
      values (${(req.session as any).userId},${postId},${realValue});
      update post
      set points = points + ${realValue}
      where id = ${postId};
      COMMIT;
      `
    );
    return true;
  }
}
