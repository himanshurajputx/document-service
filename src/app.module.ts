import { Module } from '@nestjs/common';
import { FileUploadModule } from './file-upload/file-upload.module';
import { HealthModule } from './health/health.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from '@shared/logger/logger.module';

@Module({
  imports: [
   ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    LoggerModule,
    FileUploadModule,
    HealthModule
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule { }
