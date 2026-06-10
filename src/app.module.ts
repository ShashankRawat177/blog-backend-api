import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';
import { LikesModule } from './likes/likes.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Ihb5101945',
      database: 'blog_db',

      entities: [User, Post, Comment, LikesModule, TagsModule],

      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,

    AuthModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    TagsModule,
  ],
})
export class AppModule {}
