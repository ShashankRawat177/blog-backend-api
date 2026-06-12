import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  Patch,
  Query,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/strategy/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { Role } from '../users/enums/role.enum';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @Roles(Role.AUTHOR, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ) {
    return this.postsService.create(
      createPostDto,
      req.user.id,
    );
  }

  @Get()
  findAll(
    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.postsService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Delete(':id')
  @Roles(Role.AUTHOR, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.postsService.remove(
      id,
      req.user.id,
      req.user.role,
    );
  }

  @Patch(':id')
  @Roles(Role.AUTHOR, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,

    @Body()
    updatePostDto: UpdatePostDto,

    @Req()
    req,
  ) {
    return this.postsService.update(
      id,
      updatePostDto,
      req.user.id,
      req.user.role,
    );
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.postsService.search(
      query,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postsService.findOne(id);
  }
}