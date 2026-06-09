import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 255,
  })
  title!: string;

  @Column('text')
  content!: string;

  @ManyToOne(() => User)
  author!: User;
  @Column({
    default: 0,
  })
  likeCount!: number;

  @Column({
    default: 0,
  })
  commentCount!: number;

  @Column({
    default: 0,
  })
  shareCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}