import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';

import { LikesService } from './likes.service';

import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
  ) {}

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  likePost(
    @Param(
      'postId',
      ParseIntPipe,
    )
    postId: number,

    @Req()
    req,
  ) {
    return this.likesService.likePost(
      postId,
      req.user.id,
    );
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  unlikePost(
    @Param(
      'postId',
      ParseIntPipe,
    )
    postId: number,

    @Req()
    req,
  ) {
    return this.likesService.unlikePost(
      postId,
      req.user.id,
    );
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }
}