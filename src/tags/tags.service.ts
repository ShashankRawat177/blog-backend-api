import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from './entities/tag.entity';
import { Post } from '../posts/entities/post.entity';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(name: string) {
    const existing =
      await this.tagsRepository.findOne({
        where: { name },
      });

    if (existing) {
      throw new ConflictException(
        'Tag already exists',
      );
    }

    const tag =
      this.tagsRepository.create({
        name,
      });

    return this.tagsRepository.save(tag);
  }

  async findAll() {
    return this.tagsRepository.find();
  }

  async addTagToPost(
    tagId: number,
    postId: number,
  ) {
    const tag =
      await this.tagsRepository.findOne({
        where: { id: tagId },
      });

    const post =
      await this.postsRepository.findOne({
        where: { id: postId },
        relations: ['tags'],
      });

    if (!tag) {
      throw new NotFoundException(
        'Tag not found',
      );
    }

    if (!post) {
      throw new NotFoundException(
        'Post not found',
      );
    }

    post.tags.push(tag);

    return this.postsRepository.save(post);
  }

  async update(
    id: number,
    updateTagDto: UpdateTagDto,
    ) {
    const tag =
        await this.tagsRepository.findOne({
        where: { id },
        });

    if (!tag) {
        throw new NotFoundException(
        `Tag with id ${id} not found`,
        );
    }

    Object.assign(
        tag,
        updateTagDto,
    );

    return this.tagsRepository.save(tag);
    }

    async remove(id: number) {
    const tag =
        await this.tagsRepository.findOne({
        where: { id },
        });

    if (!tag) {
        throw new NotFoundException(
        `Tag with id ${id} not found`,
        );
    }

    await this.tagsRepository.delete(id);

    return {
        message:
        'Tag deleted successfully',
    };
    }
}