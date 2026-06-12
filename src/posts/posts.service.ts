import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    userId: number,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
    });

    return await this.postsRepository.save(post);
  }

  async findAll(
    page = 1,
    limit = 10,
  ) {
    const [posts, total] =
      await this.postsRepository.findAndCount({
        relations: [
          'author',
          'tags',
        ],
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });

    return {
      data: posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit,
      ),
    };
  }

  async findOne(id: number) {
    const post =
      await this.postsRepository.findOne({
        where: { id },
        relations: [
          'author',
          'tags',
        ],
      });
    return post;
  }

  async remove(
    id: number,
    userId: number,
    role: string,
  ) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(
        `Post with id ${id} not found`,
      );
    }

    if (
      role !== 'admin' &&
      post.author.id !== userId
    ) {
      throw new ForbiddenException(
        'You can only delete your own posts',
      );
    }

    await this.postsRepository.delete(id);

    return {
      message: 'Post deleted successfully',
    };
  }

  async update(
  id: number,
  updatePostDto: UpdatePostDto,
  userId: number,
  role: string,
  ) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(
        `Post with id ${id} not found`,
      );
    }

    if (
      role !== 'admin' &&
      post.author.id !== userId
    ) {
      throw new ForbiddenException(
        'You can only edit your own posts',
      );
    }

    Object.assign(post, updatePostDto);

    return this.postsRepository.save(post);
  }

  async search(
    query: string,
    page = 1,
    limit = 10,
  ) {
    const [posts, total] =
      await this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect(
          'post.author',
          'author',
        )
        .leftJoinAndSelect(
          'post.tags',
          'tag',
        )
        .where(
          'LOWER(post.title) LIKE LOWER(:query)',
          {
            query: `%${query}%`,
          },
        )
        .orWhere(
          'LOWER(post.content) LIKE LOWER(:query)',
          {
            query: `%${query}%`,
          },
        )
        .orWhere(
          'LOWER(tag.name) LIKE LOWER(:query)',
          {
            query: `%${query}%`,
          },
        )
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

    return {
      data: posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit,
      ),
    };
  }
}