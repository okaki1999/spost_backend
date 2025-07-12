const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log('Starting data migration...');

    // 1. 既存の投稿データを取得
    const existingPosts = await prisma.$queryRaw`
      SELECT DISTINCT "userId" FROM posts
    `;

    console.log(`Found ${existingPosts.length} unique users in posts`);

    // 2. 各ユーザーに対してユーザーレコードを作成
    for (const post of existingPosts) {
      const userId = post.userId;

      // ユーザーが既に存在するかチェック
      const existingUser = await prisma.user.findUnique({
        where: { firebaseUid: userId },
      });

      if (!existingUser) {
        // 新しいユーザーを作成
        await prisma.user.create({
          data: {
            firebaseUid: userId,
            email: `${userId}@example.com`, // 仮のメールアドレス
            name: `User ${userId.substring(0, 8)}`,
          },
        });
        console.log(`Created user: ${userId}`);
      }
    }

    // 3. 投稿テーブルの外部キー制約を一時的に無効化
    console.log('Updating posts table...');

    // 投稿テーブルを新しいスキーマに合わせて更新
    await prisma.$executeRaw`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS "userInternalId" UUID;
    `;

    // 各投稿に対してユーザーの内部IDを設定
    const allPosts = await prisma.$queryRaw`
      SELECT id, "userId" FROM posts
    `;

    for (const post of allPosts) {
      const user = await prisma.user.findUnique({
        where: { firebaseUid: post.userId },
      });

      if (user) {
        await prisma.$executeRaw`
          UPDATE posts
          SET "userInternalId" = ${user.id}::UUID
          WHERE id = ${post.id}::UUID
        `;
      }
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
