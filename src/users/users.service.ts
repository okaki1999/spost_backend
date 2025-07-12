import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Firebase UIDでユーザーを取得
  getUserByFirebaseUid(firebaseUid: string) {
    return (this.prisma as any).user.findUnique({
      where: { firebaseUid },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10, // 最新10件
        },
      },
    });
  }

  // ユーザーを作成または更新
  createOrUpdateUser(
    firebaseUid: string,
    email: string,
    data?: { name?: string; avatar?: string },
  ) {
    return (this.prisma as any).user.upsert({
      where: { firebaseUid },
      update: {
        email,
        ...data,
        updatedAt: new Date(),
      },
      create: {
        firebaseUid,
        email,
        name: data?.name,
        avatar: data?.avatar,
      },
    });
  }

  // ユーザー情報を更新
  updateUser(firebaseUid: string, data: { name?: string; avatar?: string }) {
    return (this.prisma as any).user.update({
      where: { firebaseUid },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }
}
