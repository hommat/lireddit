import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from 'typeorm';

import { Post } from '@entities/Post';
import { User } from '@entities/User';

@Entity()
export class Vote extends BaseEntity {
  @Column({ type: 'int' })
  value: number;

  @PrimaryColumn({ type: 'int' })
  userId: number;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @PrimaryColumn({ type: 'int' })
  postId: number;

  @ManyToOne(() => Post, (post) => post.votes)
  post: Post;
}
