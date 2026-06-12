import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Tag } from '../../tags/entities/tag.entity';

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToMany(
    () => Tag,
    (tag) => tag.posts,
    {
      cascade: true,
    },
  )
  @JoinTable()
  tags!: Tag[];
}