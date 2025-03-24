import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './entites/message.entity';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':chatId/messages')
  async getMessagesByChatId(
    @Param('chatId') chatId: string,
  ): Promise<Message[]> {
    return this.messageService.getMessagesByChatId(chatId);
  }
}
