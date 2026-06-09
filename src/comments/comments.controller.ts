import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';

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
}