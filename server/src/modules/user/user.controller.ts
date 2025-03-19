import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthRequest } from 'src/types/auth-request';
import { SelfOrAdminGuard } from '../auth/guard/role.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Req() req: AuthRequest) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException();
    }
    return this.userService.getUsers();
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  @UseInterceptors(FilesInterceptor('profile_image'))
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      const fileUrl = await this.fileService.handleFileUpload({
        files,
        userId,
      });
      updateUserDto.profile_image = fileUrl;
    }
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
