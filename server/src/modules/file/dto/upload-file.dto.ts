import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  files: Express.Multer.File[];

  @IsNotEmpty()
  @IsString()
  userId: string;
}
