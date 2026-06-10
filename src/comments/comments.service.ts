import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
    postId: number,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(
        'Post not found',
      );
    }

    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      author: user,
      post,
    });

    const savedComment =
      await this.commentsRepository.save(comment);

    await this.postsRepository.increment(
      { id: post.id },
      'commentCount',
      1,
    );

    return savedComment;
  }

  async findAll() {
    return await this.commentsRepository.find({
      relations: [
        'author',
        'post',
      ],
    });
  }

  async findOne(id: number) {
    const comment =
      await this.commentsRepository.findOne({
        where: { id },
        relations: [
          'author',
          'post',
        ],
      });

    if (!comment) {
      throw new NotFoundException(
        `Comment with id ${id} not found`,
      );
    }

    return comment;
  }

  async remove(
    id: number,
    userId: number,
    role: string,) {
    const comment =
      await this.commentsRepository.findOne({
        where: { id },
        relations: ['post'],
      });

    if (!comment) {
      throw new NotFoundException(
        `Comment with id ${id} not found`,
      );
    }

    await this.commentsRepository.delete(id);

    await this.postsRepository.decrement(
      { id: comment.post.id },
      'commentCount',
      1,
    );

    return {
      message:
        'Comment deleted successfully',
    };
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
    role: string,
  ) {
    const comment =
      await this.commentsRepository.findOne({
        where: { id },
        relations: ['author'],
      });

    if (!comment) {
      throw new NotFoundException(
        `Comment with id ${id} not found`,
      );
    }

    if (
      role !== 'admin' &&
      comment.author.id !== userId
    ) {
      throw new ForbiddenException(
        'You can only edit your own comments',
      );
    }

    Object.assign(
      comment,
      updateCommentDto,
    );

    return this.commentsRepository.save(
      comment,
    );
  }
}