import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

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
