import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@shared/database/database.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HealthService {
  constructor(
    private readonly db: DatabaseService
  ) { }
  private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads');

  async checkHealth() {
    // Check if upload folder exists and is writable
    const uploadExists = fs.existsSync(this.uploadDir);

    const status = await this.db.status();
    // Try a ping; if it throws, we report unhealthy but don’t crash the app
    let pingOk = false;
    try {
      const res = await this.db.ping();
      pingOk = res.ok;
    } catch {
      pingOk = false;
    }

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
      dataBase:{
         ...status,
        ping: pingOk,
      },
      uploadDirectory: {
        exists: uploadExists,
        writable,
        path: this.uploadDir,
      },
    };
  }
}
