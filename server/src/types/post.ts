import { InputType, Field, ObjectType } from 'type-graphql';

import { Post } from '../entities/Post';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}
