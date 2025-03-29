import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsString()
  chatId: string;

  @IsString()
  chatType: 'personal';

  @IsArray()
  @IsString({ each: true })
  participants: string[];

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
