import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('postId', ParseIntPipe)
    postId: number,

    @Body()
    createCommentDto: CreateCommentDto,

    @Req()
    req,
  ) {
    return this.commentsService.create(
      createCommentDto,
      req.user.id,
      postId,
    );
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,

    @Body()
    updateCommentDto: UpdateCommentDto,

    @Req()
    req,
  ) {
    return this.commentsService.update(
      id,
      updateCommentDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.commentsService.remove(
      id,
      req.user.id,
      req.user.role,
    );
  }
}