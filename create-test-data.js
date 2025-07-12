const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('Creating test data...');

    // テストユーザーを作成
    const testUser = await prisma.user.create({
      data: {
        firebaseUid: 'test-user-123',
        email: 'test@example.com',
        name: 'テストユーザー',
      },
    });

    console.log('Created test user:', testUser.name);

    // テスト投稿を作成
    const testPosts = [
      {
        title: '福岡の美味しいラーメン店',
        body: '天神駅近くの隠れた名店を発見しました！',
        userId: testUser.id,
        latitude: 33.56510927234093,
        longitude: 130.40225220818743,
      },
      {
        title: '福岡タワーからの眺め',
        body: '今日は天気が良くて、博多湾がとても綺麗でした。',
        userId: testUser.id,
        latitude: 33.56510927234093 + 0.0001,
        longitude: 130.40225220818743 + 0.0001,
      },
    ];

    for (const postData of testPosts) {
      await prisma.$executeRaw`
        INSERT INTO posts (id, title, body, "userId", "createdAt", location)
        VALUES (
          gen_random_uuid(),
          ${postData.title},
          ${postData.body},
          ${postData.userId}::UUID,
          NOW(),
          ST_SetSRID(ST_MakePoint(${postData.longitude}, ${postData.latitude}), 4326)
        )
      `;
      console.log(`Created post: ${postData.title}`);
    }

    console.log('Test data created successfully!');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
