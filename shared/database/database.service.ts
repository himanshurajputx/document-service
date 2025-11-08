import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.connection.on('connected', () => {
      this.logger.log(`MongoDB connected to ${this.connection.name}`);
    });
    this.connection.on('disconnected', () => {
      this.logger.warn('MongoDB disconnected');
    });
    this.connection.on('error', (err) => {
      this.logger.error(`MongoDB error: ${err?.message || err}`);
    });
  }

  /** 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting */
  get readyState(): number {
    return this.connection.readyState;
  }

  /** true when readyState === 1 */
  isConnected(): boolean {
    return this.connection.readyState === 1;
  }

  /** Admin ping (throws if not healthy) */
  async ping(): Promise<{ ok: boolean; db: string }> {
    // Will throw if connection is not established
    if (!this.connection.db) {
      throw new Error('Database connection is not established.');
    }
    const res = await this.connection.db.admin().ping();
    return { ok: !!res?.ok, db: this.connection.name };
  }

  /** Structured status for health endpoint/logging */
  async status(): Promise<{
    connected: boolean;
    state: 'disconnected' | 'connected' | 'connecting' | 'disconnecting';
    dbName: string;
    host?: string;
  }> {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'] as const;
    const { host } = (this.connection.getClient().options as { host?: string }) || {};
    return {
      connected: this.isConnected(),
      state: states[this.readyState],
      dbName: this.connection.name,
      host,
    };
  }
}
