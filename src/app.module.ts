import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseConfigService } from './firebase/firebase.config';
import { PrismaService } from './prisma/prisma.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [AppController, PostsController, UsersController],
  providers: [
    AppService,
    FirebaseConfigService,
    PrismaService,
    PostsService,
    UsersService,
  ],
})
export class AppModule {}
