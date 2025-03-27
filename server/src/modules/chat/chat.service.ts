import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Chat } from './entites/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private readonly userService: UserService,
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
          name: chatName || '알수없음',
          image: chatImage || null,
          lastMessageContent: chat.lastMessageContent,
          lastMessageTimestamp: chat.lastMessageTimestamp,
          lastMessageSenderId: chat.lastMessageSenderId,
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

  async updateLastMessage(
    chatId: string,
    lastMessage: { content: string; timestamp: string; senderId: string },
  ): Promise<void> {
    await this.chatRepository.update(chatId, {
      lastMessageContent: lastMessage.content,
      lastMessageTimestamp: lastMessage.timestamp,
      lastMessageSenderId: lastMessage.senderId,
    });
  }

  async deleteChat(
    userId: string,
    chatId: string,
  ): Promise<{ chat?: Chat; isDeleted: boolean }> {
    const chat = await this.chatRepository.findOne({ where: { chatId } });
    if (!chat) {
      throw new Error('Chat not found');
    }
    if (!chat.participants.includes(userId)) {
      throw new Error('You are not a participant of this chat');
    }

    chat.participants = chat.participants.filter((id) => id !== userId);
    if (chat.participants.length === 0) {
      await this.chatRepository.remove(chat);
      return { isDeleted: true };
    } else {
      await this.chatRepository.save(chat);
      return { chat, isDeleted: false };
    }
  }

  async deleteUserFromAllChats(userId: string): Promise<void> {
    const chats = await this.chatRepository.find({
      where: { participants: Like(`%${userId}%`) },
    });
    for (const chat of chats) {
      chat.participants = chat.participants.filter((id) => id !== userId);
      if (chat.participants.length === 0) {
        await this.chatRepository.remove(chat);
      } else {
        await this.chatRepository.save(chat);
      }
    }
  }
}
