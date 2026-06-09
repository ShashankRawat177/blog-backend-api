import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

import { CreateCommentDto } from './dto/create-comment.dto';

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

    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      author: user,
      post,
    });

    return this.commentsRepository.save(comment);
  }

  async findAll() {
    return this.commentsRepository.find();
  }
}