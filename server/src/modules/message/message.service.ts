import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entites/message.entity';
import { Chat } from '../chat/entites/chat.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async createMessage(
    chatId: string,
    fromUserId: string,
    toUserId: string,
    content: string,
  ): Promise<Message> {
    const chat = await this.chatRepository.findOne({
      where: { chatId },
      relations: ['messages'],
    });

    const message = new Message();
    message.chatId = chatId;
    message.chat = chat;
    message.fromUserId = fromUserId;
    message.toUserId = toUserId;
    message.content = content;
    message.timestamp = new Date().toISOString();

    return this.messageRepository.save(message);
  }
}
