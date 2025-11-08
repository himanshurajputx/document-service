// src/file-upload/dto/upload-file.dto.ts
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, Validate, ValidateNested } from 'class-validator';
import { Matches } from 'class-validator';
import { IsBase64DataUrl } from '@shared/validators/base64-dataurl.validator';
import { Type } from 'class-transformer';

export class SingleFileDto {
 @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'fileName too long' })
  // Optional pattern check — runs only if fileName exists
  @Matches(/^[a-zA-Z0-9_\-. ]+\.[a-zA-Z0-9]{1,10}$/, {
    message: 'fileName must include a safe extension (e.g., photo.png)',
  })
  fileName?: string;

  @IsString()
  @IsNotEmpty({ message: 'fileContent is required' })
  // Accepts either "data:<mime>;base64,<data>" or raw base64; also enforces size & types
  @Validate(IsBase64DataUrl, [
    {
      allowRawBase64: true,
      maxBytes: 10 * 1024 * 1024, // 10 MB cap
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
    },
  ])
  fileContent!: string;

  // Optional: let client suggest a subfolder (we’ll sanitize in service if you use it)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_\-\/]*$/, { message: 'subfolder has invalid characters' })
  subfolder?: string;
}


export class UploadFilesDto {
  @IsArray({ message: 'files must be an array' })
  @ArrayMinSize(1, { message: 'At least one file is required' })
  @ValidateNested({ each: true })
  @Type(() => SingleFileDto)
  files!: SingleFileDto[];
}