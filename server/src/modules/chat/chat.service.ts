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
    name?: string,
    image?: string,
  ): Promise<Chat> {
    const participants = [senderId, toUserId].sort();
    const chatId = `personal-${participants.join('-')}`;

    let chat = await this.chatRepository.findOne({ where: { chatId } });
    if (!chat) {
      // 13. 채팅방이 없으면 새로 생성
      chat = this.chatRepository.create({
        chatId,
        chatType: 'personal',
        participants,
        name: name || null,
        image: image || null,
      });
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

  async getChatById(chatId: string): Promise<Chat | null> {
    return this.chatRepository.findOne({
      where: { chatId },
      relations: ['messages'],
    });
  }
}
