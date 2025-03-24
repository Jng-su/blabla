import { IsDate, IsString } from 'class-validator';

export class MessageResponseDto {
  @IsString()
  senderId: string;

  @IsString()
  content: string;

  @IsDate()
  timestamp: Date;
}
