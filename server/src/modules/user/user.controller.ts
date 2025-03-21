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
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthRequest } from 'src/types/auth-request';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  // 본인 정보
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req: AuthRequest) {
    return this.userService.getUserById(req.user.id);
  }

  // 관리자 : 모든 사용자 조회
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Req() req: AuthRequest) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException();
    }
    return this.userService.getUsers();
  }

  // 본인 친구 조회
  @Get('friends')
  @UseGuards(JwtAuthGuard)
  async getFriends(@Req() req: AuthRequest) {
    const userId = req.user.id;
    return this.userService.getFriends(userId);
  }

  // 사용자 조회
  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  // 사용자 수정
  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('profile_image'))
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.id;
    if (files && files.length > 0) {
      const fileUrl = await this.fileService.handleFileUpload({
        files,
        userId,
      });
      updateUserDto.profile_image = fileUrl;
    }
    return this.userService.updateUser(userId, updateUserDto);
  }

  // 회원 탈퇴
  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req: AuthRequest) {
    this.userService.deleteUser(req.user.id);
    return { message: 'User deleted successfully' };
  }

  // 친구 추가
  @Post('invite-friend')
  @UseGuards(JwtAuthGuard)
  async inviteFriend(@Req() req: AuthRequest, @Body('email') email: string) {
    const userId = req.user.id;
    return this.userService.inviteFriend(userId, email);
  }

  // 친구 삭제
  @Delete('remove-friend/:friendId')
  @UseGuards(JwtAuthGuard)
  async removeFriend(
    @Req() req: AuthRequest,
    @Param('friendId') friendId: string,
  ) {
    const userId = req.user.id;
    return this.userService.removeFriend(userId, friendId);
  }
}
