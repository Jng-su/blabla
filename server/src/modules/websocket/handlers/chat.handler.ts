import { Injectable } from '@nestjs/common';
import { ChatService } from '../../chat/chat.service';
import { WebsocketService } from '../services/websocket.service';
import { UserService } from '../../user/user.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { AuthSocket } from '../interface/auth-socket.interface';

@Injectable()
export class ChatHandler {
  constructor(
    private chatService: ChatService,
    private websocketService: WebsocketService,
    private userService: UserService,
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

    // 채팅 생성만
    await this.chatService.createOrGetChat(senderId, toUserId);

    console.log(`Chat created but not broadcasted yet for sender: ${senderId}`);
  }
}
