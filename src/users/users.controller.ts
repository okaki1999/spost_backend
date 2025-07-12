import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ユーザープロフィール取得
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@CurrentUser() user: { uid: string; email: string }) {
    return await this.usersService.getUserByFirebaseUid(user.uid);
  }

  // ユーザープロフィール更新
  @Put('profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @CurrentUser() user: { uid: string; email: string },
    @Body() body: { name?: string; avatar?: string },
  ) {
    return await this.usersService.updateUser(user.uid, body);
  }
}
