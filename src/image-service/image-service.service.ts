import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  
  private readonly baseUrl = 'http://localhost:7000/uploads';

  constructor() {
    this.ensureUploadFolderExists();
  }

  private async ensureUploadFolderExists() {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async convertToWebP(buffer: Buffer): Promise<{ filename: string; url: string }> {
    const filename = `${uuidv4()}.webp`;
    const fullPath = path.join(this.uploadPath, filename);

    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(fullPath);

    const url = `${this.baseUrl}/${filename}`;

    return { filename, url };
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    const filename = path.basename(new URL(imageUrl).pathname);
    const fullPath = path.join(this.uploadPath, filename);

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Failed to delete image at ${fullPath}:`, error.message);
    }
  }
}
