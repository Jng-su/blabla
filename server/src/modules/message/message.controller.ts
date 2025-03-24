import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { MessageService } from './message.service';
import { AuthRequest } from 'src/types/auth-request';
import { MessageResponseDto } from './dto/message.response';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':chatId/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Param('chatId') chatId: string,
    @Req() req: AuthRequest,
  ): Promise<MessageResponseDto[]> {
    return this.messageService.getMessagesByChatId(chatId, req.user.id);
  }
}
