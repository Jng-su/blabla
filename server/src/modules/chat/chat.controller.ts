import { Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ChatService } from './chat.service';
import { AuthRequest } from 'src/types/auth-request';
import { Chat } from './entites/chat.entity';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getChats(@Req() req: AuthRequest): Promise<Chat[]> {
    return this.chatService.getUserChats(req.user.id);
  }

  @Delete(':chatId')
  @UseGuards(JwtAuthGuard)
  async deleteChat(
    @Req() req: AuthRequest,
  ): Promise<{ chat?: Chat; isDeleted: boolean }> {
    return this.chatService.deleteChat(req.user.id, req.params.chatId);
  }
}
