import { IsNotEmpty, IsString } from 'class-validator';

export class S3ConfigDto {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
