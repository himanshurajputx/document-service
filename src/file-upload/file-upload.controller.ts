import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { UploadFilesDto } from './dto/upload-file.dto';
import { CompanyCheckGuard } from '@shared/guards/company-check.guard';
import { request } from 'http';

@Controller('files')
@UseGuards(CompanyCheckGuard) // ✅ applies only to this controller
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  async uploadFile(@Body() dto: UploadFilesDto, @Req() request) {
 

    const filePath = await this.fileUploadService.uploadBase64File(dto.files, request.company);
    return {
      message: 'File uploaded successfully',
      filePath,
    };
  }
}
