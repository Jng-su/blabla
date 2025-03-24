import { Injectable } from '@nestjs/common';
import { ChatService } from '../../chat/chat.service';
import { WebsocketService } from '../services/websocket.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { AuthSocket } from '../interface/auth-socket.interface';

@Injectable()
export class ChatHandler {
  constructor(
    private chatService: ChatService,
    private websocketService: WebsocketService,
  ) {}

  async handleCreateChat(
    client: AuthSocket,
    createChatDto: CreateChatDto,
  ): Promise<void> {
    const senderId = client.user!.id;
    const senderName = client.user!.name;

    console.log(
      `Creating chat for sender: ${senderId}, to: ${createChatDto.toUserId}`,
    );
    if (senderId === createChatDto.toUserId) {
      throw new Error('Cannot create chat with yourself');
    }

    // 6. ChatService로 채팅방 생성/조회 요청
    const chat = await this.chatService.createOrGetChat(
      senderId,
      createChatDto.toUserId,
      createChatDto.name,
      createChatDto.image,
    );

    // 7. 각 참여자에게 상대방 이름으로 채팅 정보 구성 후 전송
    const participants = chat.participants;
    participants.forEach((participantId) => {
      const isSender = participantId === senderId;
      const opponentName = isSender
        ? createChatDto.name || senderName
        : client.user!.name;

      const chatData = {
        chatId: chat.chatId,
        chatType: chat.chatType,
        participants: chat.participants,
        name: opponentName,
        image: chat.image,
      };

      // 8. WebsocketService로 클라이언트에 'chatCreated' 이벤트 전송
      this.websocketService.broadcastEvent('chatCreated', chatData, [
        participantId,
      ]);
    });

    console.log(`Chat created successfully for sender: ${senderId}`);
  }
}
