import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ChatService } from './chat.service';
import { AuthRequest } from 'src/types/auth-request';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getChats(@Req() req: AuthRequest) {
    return this.chatService.getUserChats(req.user.id);
  }
}
