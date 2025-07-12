import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log('=== アップロードサービス開始 ===');
    console.log('ファイル名:', file.originalname);
    console.log('MIMEタイプ:', file.mimetype);
    console.log('ファイルサイズ:', file.size);
    console.log('バッファサイズ:', file.buffer?.length);

        const fileName = `${Date.now()}-${file.originalname}`;
    const uploadsDir = join(process.cwd(), 'uploads');
    const filePath = join(uploadsDir, fileName);

    console.log('保存先パス:', filePath);

    try {
      // uploadsディレクトリが存在しない場合は作成
      if (!existsSync(uploadsDir)) {
        console.log('uploadsディレクトリを作成中...');
        await mkdir(uploadsDir, { recursive: true });
      }

      await writeFile(filePath, file.buffer);
      console.log('ファイル保存成功');

      // ファイルのURLを返す（実際の環境では適切なURLを設定）
      const fileUrl = `/uploads/${fileName}`;
      console.log('返却URL:', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('ファイル保存エラー:', error);
      throw error;
    }
  }
}
