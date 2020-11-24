import { getCustomRepository } from 'typeorm';

import { AppContext } from '@appTypes/app';
import { PaginatedPosts, CreatePostInput } from '@appTypes/post';
import { Post } from '@entities/Post';
import { User } from '@entities/User';
import { PostRepository } from '@repositories/PostRepository';
import { AuthService } from '@services/AuthService';

export class PostService {
  private readonly postRepository: PostRepository;
  private readonly authService: AuthService;

  constructor() {
    this.postRepository = getCustomRepository(PostRepository);
    this.authService = new AuthService();
  }

  getPostTextSnippet(post: Post): string {
    return post.text.slice(0, 50) + '...';
  }

  getPostCreator(post: Post, ctx: AppContext): Promise<User> {
    return ctx.userLoader.load(post.creatorId);
  }

  async getPostVoteStatus(post: Post, ctx: AppContext): Promise<number> {
    const userId = this.authService.getSessionUserId(ctx);
    if (!userId) {
      return 0;
    }

    const vote = await ctx.voteLoader.load({ postId: post.id, userId });
    return vote ? vote.value : 0;
  }

  async getPaginatedPosts(
    limit: number,
    cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(limit, 50);
    const realLimitPlusOne = realLimit + 1;
    const posts = await this.postRepository.getPaginatedPosts(
      realLimit,
      cursor
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  async createPost(input: CreatePostInput, ctx: AppContext): Promise<Post> {
    const creatorId = this.authService.getSessionUserId(ctx);

    return Post.create({ ...input, creatorId }).save();
  }
}
