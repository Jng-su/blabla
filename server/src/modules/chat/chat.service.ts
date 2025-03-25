import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Chat } from './entites/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private userService: UserService,
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
    const chats = await this.chatRepository.find({
      where: { participants: Like(`%${userId}%`) },
      relations: ['messages'],
    });
    const activeChats = chats.filter(
      (chat) => chat.messages && chat.messages.length > 0,
    );
    return Promise.all(
      activeChats.map(async (chat) => {
        let chatName = chat.name;
        let chatImage = chat.image;
        if (chat.chatType === 'personal') {
          const opponentId = chat.participants.find((id) => id !== userId);
          if (opponentId) {
            const opponent = await this.userService.getUserById(opponentId);
            chatName = opponent.name;
            chatImage = opponent.profile_image;
          }
        }
        return {
          ...chat,
          name: chatName || 'Unnamed Chat',
          image: chatImage || null,
        };
      }),
    );
  }

  async getChatById(chatId: string): Promise<Chat | null> {
    return this.chatRepository.findOne({
      where: { chatId },
      relations: ['messages'],
    });
  }
}
