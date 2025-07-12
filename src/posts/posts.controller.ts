import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // 投稿を作成
  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @Body()
    body: {
      title: string;
      body: string;
      latitude: number;
      longitude: number;
      imageUrl?: string;
    },
    @CurrentUser() user: { uid: string; email: string },
  ) {
    return this.postsService.createPost({
      title: body.title,
      body: body.body,
      userId: user.uid,
      latitude: body.latitude,
      longitude: body.longitude,
      imageUrl: body.imageUrl,
    });
  }

  // 近くの投稿を取得
  @Get()
  async getNearbyPosts(
    @Query('lat') latitude: string,
    @Query('lng') longitude: string,
  ) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    return this.postsService.getNearbyPosts(lat, lng);
  }
}
