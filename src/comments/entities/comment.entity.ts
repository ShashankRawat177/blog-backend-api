import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @ManyToOne(() => User)
  author!: User;

  @ManyToOne(() => Post)
  post!: Post;

  @CreateDateColumn()
  createdAt!: Date;
}
