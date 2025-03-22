import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Chat } from './entites/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async createOrGetChat(
    senderId: string,
    toUserId: string,
    chatName?: string,
    chatImage?: string,
  ): Promise<Chat> {
    const participants = [senderId, toUserId].sort();
    const chatId = `personal-${participants.join('-')}`;

    let chat = await this.chatRepository.findOne({ where: { chatId } });
    if (!chat) {
      chat = new Chat();
      chat.chatId = chatId;
      chat.chatType = 'personal';
      chat.participants = participants;
      chat.name = chatName || `${senderId}-${toUserId}`;
      chat.image = chatImage || null;
      await this.chatRepository.save(chat);
    }

    return chat;
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { participants: Like(`%${userId}%`) },
      relations: ['messages'],
    });
  }
}
