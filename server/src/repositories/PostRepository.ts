import { EntityRepository, Repository, UpdateResult } from 'typeorm';

import { Post } from '../entities/Post';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  getPaginated(limit: number, cursor: string | null): Promise<Post[]> {
    const qb = this.createQueryBuilder('p')
      .orderBy('p.createdAt', 'DESC')
      .take(limit);

    if (cursor) {
      qb.where('p.createdAt < :c', { c: new Date(+cursor) });
    }

    return qb.getMany();
  }

  addPoints(postId: number, pointsToAdd: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .where('id = :postId', { postId })
      .set({ points: () => `points + ${pointsToAdd}` })
      .execute();
  }
}
