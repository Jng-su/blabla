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

  async createMessage(
    chatId: string,
    fromUserId: string,
    toUserId: string,
    content: string,
    username: string, // username 추가
  ): Promise<Message> {
    const message = new Message();
    message.chatId = chatId;
    message.fromUserId = fromUserId;
    message.toUserId = toUserId;
    message.content = content;
    message.timestamp = new Date().toISOString();
    return this.messageRepository.save(message);
  }

  async getMessagesByChatId(
    chatId: string,
    userId: string,
  ): Promise<ClientMessageDto[]> {
    const messages = await this.messageRepository.find({
      where: { chatId },
      relations: ['fromUser'], // User 관계 로드
    });
    return messages.map((msg) => ({
      senderId: msg.fromUserId,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      username: msg.fromUser?.name || msg.fromUserId, // User 엔티티에서 이름 가져옴
    }));
  }
}
