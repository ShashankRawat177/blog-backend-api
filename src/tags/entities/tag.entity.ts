import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';

import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  name!: string;

  @ManyToMany(
    () => Post,
    (post) => post.tags,
  )
  posts!: Post[];
}