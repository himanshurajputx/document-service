import { Controller, Post, Body } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  async uploadFile(@Body() dto: UploadFileDto) {
    const { fileName, fileContent } = dto;

    if (fileName || !fileContent) {
      return { message: 'Missing fileName or fileContent' };
    }

    const filePath = await this.fileUploadService.uploadBase64File(fileContent, fileName);
    return {
      message: 'File uploaded successfully',
      filePath,
    };
  }
}
