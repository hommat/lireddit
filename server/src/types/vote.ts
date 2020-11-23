import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class VoteInput {
  @Field(() => Int)
  postId: number;

  @Field(() => Int)
  value: number;
}
