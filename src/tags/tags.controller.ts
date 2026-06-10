import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';

import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
  ) {}

  @Post()
  create(
    @Body()
    createTagDto: CreateTagDto,
  ) {
    return this.tagsService.create(
      createTagDto.name,
    );
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Post(':tagId/posts/:postId')
  addTagToPost(
    @Param(
      'tagId',
      ParseIntPipe,
    )
    tagId: number,

    @Param(
      'postId',
      ParseIntPipe,
    )
    postId: number,
  ) {
    return this.tagsService.addTagToPost(
      tagId,
      postId,
    );
  }

    @Patch(':id')
    update(
    @Param(
        'id',
        ParseIntPipe,
    )
    id: number,

    @Body()
    updateTagDto: UpdateTagDto,
    ) {
    return this.tagsService.update(
        id,
        updateTagDto,
    );
    }

    @Delete(':id')
    remove(
    @Param(
        'id',
        ParseIntPipe,
    )
    id: number,
    ) {
    return this.tagsService.remove(id);
    }
}