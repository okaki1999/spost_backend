import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseConfigService } from './firebase/firebase.config';
import { PrismaService } from './prisma/prisma.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';

@Module({
  imports: [],
  controllers: [AppController, PostsController],
  providers: [AppService, FirebaseConfigService, PrismaService, PostsService],
})
export class AppModule {}
