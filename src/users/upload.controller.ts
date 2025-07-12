import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';

@Controller('upload')
export class UploadController {
  constructor(private usersService: UsersService) {}

  // アバター画像アップロード
  @Post('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @CurrentUser() user: { uid: string; email: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    // TODO: Firebase Storageにアップロード
    // 仮の実装：ファイル名を返す
    const avatarUrl = `https://storage.googleapis.com/your-bucket/avatars/${user.uid}/${file.filename}`;

    // ユーザー情報を更新
    await this.usersService.updateUser(user.uid, { avatar: avatarUrl });

    return { avatarUrl };
  }
}
