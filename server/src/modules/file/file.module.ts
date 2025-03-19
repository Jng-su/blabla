import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { S3ConfigService } from './s3-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [FileService, S3ConfigService],
  exports: [FileService],
})
export class FileModule {}
