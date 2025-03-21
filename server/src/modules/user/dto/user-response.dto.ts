import { IsString, IsOptional } from 'class-validator';

export class UserResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  profile_image?: string;

  @IsString()
  @IsOptional()
  statusMessage?: string;

  @IsString({ each: true })
  friends: string[];
}
