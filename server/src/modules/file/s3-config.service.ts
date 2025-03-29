import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { S3ConfigDto } from './dto/s3-config.dto';

@Injectable()
export class S3ConfigService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  private generateFileKey(s3ConfigDto: S3ConfigDto): string {
    const { file, userId } = s3ConfigDto;
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
    return `user/${userId}/${timestamp}_${sanitizedFileName}`;
  }

  getUploadParams(s3ConfigDto: S3ConfigDto): S3.Types.PutObjectRequest {
    const { file } = s3ConfigDto;
    try {
      const fileKey = this.generateFileKey(s3ConfigDto);
      return {
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
    } catch (error) {
      throw new Error(`Error generating upload parameters: ${error.message}`);
    }
  }

  async uploadToS3(
    uploadParams: S3.Types.PutObjectRequest,
  ): Promise<S3.ManagedUpload.SendData> {
    try {
      return await this.s3.upload(uploadParams).promise();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteFiles(fileUrls: string[]): Promise<void> {
    const keys = fileUrls.map((url) => {
      const urlParts = new URL(url);
      return urlParts.pathname.slice(1);
    });
    const deleteParams = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    };
    await this.s3.deleteObjects(deleteParams).promise();
  }
}
