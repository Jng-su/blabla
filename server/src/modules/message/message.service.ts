import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entites/message.entity';

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
  ) {}

  async saveMessage(
    chatId: string,
    fromUserId: string,
    toUserId: string,
    content: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      chatId,
      fromUserId,
      toUserId,
      content,
      timestamp: new Date().toISOString(),
    });
    return this.messageRepository.save(message);
  }

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chatId },
      order: { timestamp: 'ASC' },
    });
  }

  async getMessageCount(chatId: string): Promise<number> {
    return this.messageRepository.count({ where: { chatId } });
  }
}
