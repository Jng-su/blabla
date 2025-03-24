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
    const chats = await this.chatService.getUserChats(req.user.id);
    return chats.map((chat) => ({
      chatId: chat.chatId,
      chatType: chat.chatType as 'personal',
      participants: chat.participants,
    }));
  }
}
