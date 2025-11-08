import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HealthService {
  private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads');

  checkHealth() {
    // Check if upload folder exists and is writable
    const uploadExists = fs.existsSync(this.uploadDir);

    let writable = false;
    try {
      fs.accessSync(this.uploadDir, fs.constants.W_OK);
      writable = true;
    } catch {
      writable = false;
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'File Upload Service',
      uploadDirectory: {
        exists: uploadExists,
        writable,
        path: this.uploadDir,
      },
    };
  }
}
