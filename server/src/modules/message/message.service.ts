import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entites/message.entity';
import { ChatService } from '../chat/chat.service';

export interface ClientMessageDto {
  senderId: string;
  content: string;
  timestamp: Date;
  username: string;
}

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly chatService: ChatService,
  ) {}

  async saveMessage(
    chatId: string,
    fromUserId: string,
    toUserId: string,
    content: string,
  ): Promise<Message> {
    const chat = await this.chatService.getChatById(chatId);
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }
    const message = this.messageRepository.create({
      chat,
      fromUserId,
      toUserId,
      content,
      timestamp: new Date().toISOString(),
    });
    return this.messageRepository.save(message);
  }

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: {
        chat: { chatId },
      },
      order: { timestamp: 'ASC' },
      relations: ['chat'],
    });
  }

  async getMessageCount(chatId: string): Promise<number> {
    return this.messageRepository.count({
      where: {
        chat: { chatId },
      },
    });
  }
}
