import { IsNotEmpty, IsString } from 'class-validator';

export class PrivateMessageDto {
  @IsString()
  @IsNotEmpty()
  toUserId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
