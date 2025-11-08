import { Injectable, BadRequestException } from '@nestjs/common';
import { parseFileSize } from '@shared/utils/file-size.util';
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
  async uploadBase64File(files: { fileName?: string; fileContent: string; subfolder?: string }[], organization?: any): Promise<any> {
    try {
      // ✅ Step 1: Get DB config (from organization or default)
      
      if (!Array.isArray(files) || files.length === 0)
        throw new BadRequestException('No files provided');

      let uploaded: any = [];

      const orgName = organization?.organization_name;
      const orgId = organization?.organization_id;


      for (const file of files) {
        const maxBytes = parseFileSize(organization?.file_size || '10MB');
        const allowedTypes: string[] = organization?.file_type || [];

        let subfolder = file?.subfolder || orgName || orgId || 'default';        

        // ✅ Step 2: Decode base64
        const matches = file.fileContent.match(/^data:(.+);base64,(.+)$/);
        const fileBuffer = Buffer.from(matches ? matches[2] : file.fileContent, 'base64');
        const mime = matches ? matches[1] : '';



        // ✅ Step 3: Determine extension
        let ext = '';
        if (file?.fileName) {
          ext = path.extname(file?.fileName).toLowerCase();
        } else if (mime) {
          const subtype = mime.split('/')[1];
          ext = subtype ? '.' + subtype.toLowerCase() : '';
        }

        // ✅ Step 4: Validate extension
        if (allowedTypes.length && !allowedTypes.includes(ext)) {
          throw new BadRequestException(`File type "${ext}" not allowed`);
        }

        // ✅ Step 5: Validate size
        const fileSize = fileBuffer.length;
        if (fileSize > maxBytes) {
          throw new BadRequestException(
            `File size exceeds limit. Max: ${organization?.file_size}, Received: ${(fileSize / 1024 / 1024).toFixed(2)}MB`,
          );
        }

        // ✅ Step 6: Create date-based subfolder
        const folderName = new Date().toISOString().split('T')[0];
        let targetDir = path.join(this.baseUploadDir, folderName);

        if (subfolder) {
          const safeSub = subfolder.replace(/[^a-zA-Z0-9_\-/]/g, '').replace(/^\/*|\/*$/g, '');
          targetDir = path.join(targetDir, safeSub);
        }

        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // ✅ Step 7: Generate safe file name
        let safeFileName: string;
        if (file?.fileName) {
          const base = path.basename(file.fileName).replace(/[^a-zA-Z0-9_.-]/g, '_');
          safeFileName = base.length > 3 ? base : `${uuidv4()}${ext}`;
        } else {
          safeFileName = `${uuidv4()}${ext || '.bin'}`;
        }

        const filePath = path.join(targetDir, safeFileName);
        fs.writeFileSync(filePath, fileBuffer);

        // ✅ Step 8: Build relative public URL
        const relativePath = `/uploads/${folderName}${subfolder ? '/' + subfolder : ''}/${safeFileName}`;
        // return relativePath.replace(/\\/g, '/');
        uploaded.push({
          fileName: safeFileName,
          url: relativePath.replace(/\\/g, '/'),
        });

      }
       return { uploaded };

    } catch (err) {
      throw new BadRequestException('File upload failed: ' + err.message);
    }
  }
}
