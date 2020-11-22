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
import { AppContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getCustomRepository } from 'typeorm';
import { User } from '../entities/User';
import { PostRepository } from '../repositories/PostRepository';

@InputType()
class CreatePostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post): string {
    return post.text.slice(0, 50) + '...';
  }

  @FieldResolver(() => User)
  async creator(
    @Root() { creatorId }: Post,
    @Ctx() { userLoader }: AppContext
  ): Promise<User> {
    return userLoader.load(creatorId);
  }

  @FieldResolver(() => Int)
  async voteStatus(
    @Root() post: Post,
    @Ctx() { req, voteLoader }: AppContext
  ): Promise<number> {
    const { userId } = req.session;
    if (!userId) {
      return 0;
    }

    const vote = await voteLoader.load({
      postId: post.id,
      userId,
    });

    return vote ? vote.value : 0;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(limit, 50);
    const realLimitPlusOne = realLimit + 1;
    const posts = await getCustomRepository(PostRepository).getPaginated(
      realLimit,
      cursor
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('createPostInput') createPostInput: CreatePostInput,
    @Ctx() { req }: AppContext
  ): Promise<Post> {
    const creatorId = req.session.userId;

    return Post.create({ ...createPostInput, creatorId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);

    if (!post) {
      return null;
    }

    if (typeof title !== 'undefined') {
      await Post.update({ id }, { title });
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
