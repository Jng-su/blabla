import { Injectable, BadRequestException } from '@nestjs/common';
import { S3ConfigService } from './s3-config.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { S3ConfigDto } from './dto/s3-config.dto';

@Injectable()
export class FileService {
  constructor(private readonly s3ConfigService: S3ConfigService) {}

  async handleFileUpload(uploadFileDto: UploadFileDto): Promise<string> {
    const { files, userId } = uploadFileDto;
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    if (files.length > 1) {
      throw new BadRequestException('하나의 파일만 업로드할 수 있습니다.');
    }
    const fileLocation = await this.uploadFileHelper({
      file: files[0],
      userId,
    });
    return fileLocation;
  }

  private async uploadFileHelper(s3ConfigDto: S3ConfigDto): Promise<string> {
    try {
      const uploadParams = this.s3ConfigService.getUploadParams(s3ConfigDto);
      const data = await this.s3ConfigService.uploadToS3(uploadParams);
      return data.Location;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteFiles(fileUrls: string[]): Promise<void> {
    const filesToDelete = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
    await this.s3ConfigService.deleteFiles(filesToDelete);
  }
}
