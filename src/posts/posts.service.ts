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
    imageUrl?: string;
  }) {
    // まずユーザーを取得または作成
    const user = await (this.prisma as any).user.upsert({
      where: { firebaseUid: data.userId },
      update: {},
      create: {
        firebaseUid: data.userId,
        email: `${data.userId}@example.com`, // 仮のメールアドレス
        name: `User ${data.userId.substring(0, 8)}`,
      },
    });

    return this.prisma.$executeRaw`
      INSERT INTO posts (id, title, body, "imageUrl", "userId", "createdAt", location)
      VALUES (
        gen_random_uuid(),
        ${data.title},
        ${data.body},
        ${data.imageUrl || null},
        ${user.id},
        NOW(),
        ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)
      )
    `;
  }

  // 指定位置の半径100m以内の投稿を取得
  async getNearbyPosts(latitude: number, longitude: number) {
    return this.prisma.$queryRaw`
      SELECT
        p.id,
        p.title,
        p.body,
        p."imageUrl",
        p."userId",
        p."createdAt",
        ST_AsText(p.location) as location,
        u.name as "userName",
        u.email as "userEmail",
        u.avatar as "userAvatar"
      FROM posts p
      LEFT JOIN users u ON p."userId" = u.id
      WHERE ST_DWithin(
        p.location::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        100
      )
      ORDER BY p."createdAt" DESC
    `;
  }
}
