import { IsString, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsString()
  toUserId: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
