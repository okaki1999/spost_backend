import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB制限
      },
      fileFilter: (req, file, cb) => {
                // 許可する画像MIMEタイプ
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `画像ファイルのみアップロード可能です。許可されている形式: ${allowedMimeTypes.join(', ')}`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log('=== アップロードコントローラー開始 ===');
    console.log('ファイル受信:', file ? 'OK' : 'NG');

    if (!file) {
      console.log('ファイルが提供されていません');
      throw new BadRequestException('画像ファイルが提供されていません');
    }

    console.log('ファイル情報:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const fileUrl = await this.uploadService.uploadFile(file);
    console.log('アップロード完了:', fileUrl);

    const response = {
      success: true,
      url: fileUrl,
      filename: file.originalname,
    };

    console.log('レスポンス:', response);
    return response;
  }
}
