import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { DocEntity, DocEntitySchema } from '@shared/schema/organization_file_upload.schema';
import { CompanyCheckGuard } from '@shared/guards/company-check.guard';
import { StreamUploadController } from './stream-upload/stream-upload.controller';
import { StreamUploadService } from './stream-upload/stream-upload.service';

@Module({

  controllers: [FileUploadController, StreamUploadController],
  providers: [FileUploadService, CompanyCheckGuard, StreamUploadService],
})
export class FileUploadModule {}
