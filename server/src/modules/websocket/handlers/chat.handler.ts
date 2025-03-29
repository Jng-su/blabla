import { Injectable } from '@nestjs/common';
import { ChatService } from '../../chat/chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { AuthSocket } from '../interface/auth-socket.interface';
import { WebSocketManagerService } from '../services/websocket.manager.service';

@Injectable()
export class ChatHandler {
  constructor(
    private chatService: ChatService,
    private webSocketManager: WebSocketManagerService,
  ) {}

  async handleCreateChat(
    client: AuthSocket,
    createChatDto: CreateChatDto,
  ): Promise<void> {
    const senderId = client.user!.id;
    const toUserId = createChatDto.participants.find((id) => id !== senderId);
    console.log(
      `✅ Creating chat for sender UserId: ${senderId}, toUserId: ${toUserId}`,
    );
    if (senderId === toUserId) {
      throw new Error('Cannot create chat with yourself');
    }
    await this.chatService.createOrGetChat(senderId, toUserId);
    console.log(`Chat created but not broadcasted yet for sender: ${senderId}`);
  }

  async handleLeaveChat(client: AuthSocket, chatId: string): Promise<void> {
    const userId = client.user!.id;
    const result = await this.chatService.deleteChat(userId, chatId);
    console.log(`✅ User ${userId} left chat ${chatId}`);
    if (result.isDeleted) {
      this.webSocketManager.emitToAll('chatDeleted', { chatId });
    } else {
      this.webSocketManager.emitToAll('chatLeft', { chatId, userId });
    }
  }
}
