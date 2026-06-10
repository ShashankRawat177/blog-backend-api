import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async likePost(
    postId: number,
    userId: number,
  ) {
    const user =
      await this.usersRepository.findOne({
        where: { id: userId },
      });

    const post =
      await this.postsRepository.findOne({
        where: { id: postId },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    if (!post) {
      throw new NotFoundException(
        'Post not found',
      );
    }

    const existingLike =
      await this.likesRepository.findOne({
        where: {
          user: { id: userId },
          post: { id: postId },
        },
        relations: [
          'user',
          'post',
        ],
      });

    if (existingLike) {
      throw new ConflictException(
        'Post already liked',
      );
    }

    const like =
      this.likesRepository.create({
        user,
        post,
      });

    const savedLike =
      await this.likesRepository.save(like);

    await this.postsRepository.increment(
      { id: post.id },
      'likeCount',
      1,
    );

    return savedLike;
  }

  async unlikePost(
    postId: number,
    userId: number,
  ) {
    const like =
      await this.likesRepository.findOne({
        where: {
          user: { id: userId },
          post: { id: postId },
        },
        relations: [
          'user',
          'post',
        ],
      });

    if (!like) {
      throw new NotFoundException(
        'Like not found',
      );
    }

    await this.likesRepository.delete(
      like.id,
    );

    await this.postsRepository.decrement(
      { id: postId },
      'likeCount',
      1,
    );

    return {
      message:
        'Post unliked successfully',
    };
  }

  async findAll() {
    return this.likesRepository.find({
      relations: [
        'user',
        'post',
      ],
    });
  }
}