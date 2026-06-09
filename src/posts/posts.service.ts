import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);

    return await this.postsRepository.save(post);
  }

  async findAll() {
    return await this.postsRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(
        `Post with id ${id} not found`,
      );
    }

    return post;
  }

  async remove(id: number) {
    const result = await this.postsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Post with id ${id} not found`,
      );
    }

    return {
      message: 'Post deleted successfully',
    };
  }
}