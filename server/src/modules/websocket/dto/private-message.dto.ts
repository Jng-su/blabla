import { IsNotEmpty, IsString } from 'class-validator';

export class PrivateMessageDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  toUserId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
