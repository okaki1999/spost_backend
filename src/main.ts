import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 既存のCORS設定
  app.enableCors({
    origin: true, // 必要に応じて調整
    credentials: true,
  });

  // 静的ファイルのCORS対応
  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads'), {
      setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
