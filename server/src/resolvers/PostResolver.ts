import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
} from 'type-graphql';

import { AppContext } from '@appTypes/app';
import { PaginatedPosts, CreatePostInput } from '@appTypes/post';
import { Post } from '@entities/Post';
import { User } from '@entities/User';
import { isAuth } from '@middleware/isAuth';
import { PostService } from '@services/PostService';

@Resolver(Post)
export class PostResolver {
  private readonly postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  @FieldResolver(() => String)
  textSnippet(@Root() post: Post): string {
    return this.postService.getPostTextSnippet(post);
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() ctx: AppContext): Promise<User> {
    return this.postService.getPostCreator(post, ctx);
  }

  @FieldResolver(() => Int)
  voteStatus(@Root() post: Post, @Ctx() ctx: AppContext): Promise<number> {
    return this.postService.getPostVoteStatus(post, ctx);
  }

  @Query(() => PaginatedPosts)
  posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    return this.postService.getPaginatedPosts(limit, cursor);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('createPostInput') input: CreatePostInput,
    @Ctx() ctx: AppContext
  ): Promise<Post> {
    return this.postService.createPost(input, ctx);
  }
}
