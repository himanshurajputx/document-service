import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { DocEntity, DocEntitySchema } from '@shared/schema/organization_file_upload.schema';
import { CompanyCheckGuard } from '@shared/guards/company-check.guard';

@Module({

  controllers: [FileUploadController],
  providers: [FileUploadService, CompanyCheckGuard],
})
export class FileUploadModule {}
