import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadsDir = join(process.cwd(), 'uploads');
    const filePath = join(uploadsDir, fileName);

    // uploadsディレクトリが存在しない場合は作成
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    await writeFile(filePath, file.buffer);

    // ファイルのURLを返す（実際の環境では適切なURLを設定）
    const fileUrl = `/uploads/${fileName}`;
    return fileUrl;
  }
}
