import { Module } from '@nestjs/common';
import { FileUploadModule } from './file-upload/file-upload.module';
import { HealthModule } from './health/health.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from '@shared/logger/logger.module';
import { DatabaseModule } from '@shared/database/database.module';
import { CompanyCheckGuard } from '@shared/guards/company-check.guard';

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
    DatabaseModule,
    FileUploadModule,
    HealthModule
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CompanyCheckGuard
  ],
    exports: [CompanyCheckGuard],

})
export class AppModule { }
