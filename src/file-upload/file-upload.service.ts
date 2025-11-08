import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly baseUploadDir: string;

  constructor() {
    // Automatically pick a safe parent directory outside project root
    const projectRoot = path.resolve(__dirname, '../../../../');
    this.baseUploadDir = path.resolve(projectRoot, '../uploads');

    // Ensure base upload directory exists
    if (!fs.existsSync(this.baseUploadDir)) {
      fs.mkdirSync(this.baseUploadDir, { recursive: true });
      console.log('📁 Created base upload directory:', this.baseUploadDir);
    }
  }

  /**
   * Uploads a base64 file, auto-creates daily folder, and returns public URL.
   * If fileName is provided → use sanitized name; else → UUID-based filename.
   */
  async uploadBase64File(base64Data: string, originalFileName?: string, subfolder?: string): Promise<string> {
    try {
      // 🗓️ Create date-based subfolder
      const folderName = new Date().toISOString().split('T')[0];
      let targetDir = path.join(this.baseUploadDir, folderName);

      // Optional user-defined subfolder (sanitized)
      if (subfolder) {
        const safeSub = subfolder.replace(/[^a-zA-Z0-9_\-/]/g, '').replace(/^\/*|\/*$/g, '');
        targetDir = path.join(targetDir, safeSub);
      }

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 🧩 Determine safe filename
      let safeFileName: string;
      const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
      const fileBuffer = Buffer.from(matches ? matches[2] : base64Data, 'base64');

      if (originalFileName) {
        // sanitize filename, keep extension if present
        const base = path.basename(originalFileName).replace(/[^a-zA-Z0-9_.-]/g, '_');
        safeFileName = base.length > 3 ? base : `${uuidv4()}`;
      } else {
        // fallback: detect extension from mime or use .bin
        const mime = matches ? matches[1] : '';
        let ext = '';
        if (mime.startsWith('image/')) {
          ext = '.' + mime.split('/')[1];
        } else if (mime === 'application/pdf') {
          ext = '.pdf';
        } else {
          ext = '.bin';
        }
        safeFileName = `${uuidv4()}${ext}`;
      }

      const filePath = path.join(targetDir, safeFileName);
      fs.writeFileSync(filePath, fileBuffer);

      // ✅ Build public URL (served by Express)
      const relativePath = `/uploads/${folderName}${subfolder ? '/' + subfolder : ''}/${safeFileName}`;
      return relativePath.replace(/\\/g, '/'); // normalize for Windows
    } catch (err) {
      throw new BadRequestException('File upload failed: ' + err.message);
    }
  }
}
