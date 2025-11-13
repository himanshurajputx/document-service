import { Injectable, BadRequestException } from '@nestjs/common';
import { getUploadDir } from '@shared/utils/upload-dir';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StreamUploadService {


  readonly baseDir = getUploadDir();

  constructor() {
    if (!fs.existsSync(this.baseDir)) fs.mkdirSync(this.baseDir, { recursive: true });
  }
  

  /** Save one stream to disk with backpressure-friendly pipeline */
 async saveStreamToLocal(
    fileStream: NodeJS.ReadableStream,
    targetDir: string,
    originalName?: string,
  ) {
    const ext = path.extname(originalName || '');
    const safeName = originalName
      ? path.basename(originalName).replace(/[^a-zA-Z0-9_.-]/g, '_')
      : `file_${Date.now()}${ext || ''}`;

    const fullPath = path.join(targetDir, safeName);
    await pipeline(fileStream, fs.createWriteStream(fullPath));
    const stat = await fsp.stat(fullPath);

    // ✅ derive relative URL path correctly
    const relativePath = path.relative(this.baseDir, fullPath).replace(/\\/g, '/');
    const publicUrl = `/uploads/${relativePath}`;

    return {
      fileName: safeName,
      size: (stat.size / 1024 / 1024).toFixed(2) + ' MB',
      url: publicUrl,
    };
  }
}
