import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // 投稿を作成（生SQL）
  async createPost(data: {
    title: string;
    body: string;
    userId: string;
    latitude: number;
    longitude: number;
  }) {
    return this.prisma.$executeRaw`
      INSERT INTO posts (id, title, body, "userId", "createdAt", location)
      VALUES (
        gen_random_uuid(),
        ${data.title},
        ${data.body},
        ${data.userId},
        NOW(),
        ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)
      )
    `;
  }

  // 指定位置の半径100m以内の投稿を取得
  async getNearbyPosts(latitude: number, longitude: number) {
    return this.prisma.$queryRaw`
      SELECT
        id,
        title,
        body,
        "userId",
        "createdAt",
        ST_AsText(location) as location
      FROM posts
      WHERE ST_DWithin(
        location::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        100
      )
      ORDER BY "createdAt" DESC
    `;
  }
}
