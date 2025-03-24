import { Injectable } from '@nestjs/common';
import { ChatService } from '../../chat/chat.service';
import { MessageService } from '../../message/message.service';
import { WebsocketService } from '../services/websocket.service';
import { PrivateMessageDto } from '../dto/private-message.dto';
import { AuthSocket } from '../interface/auth-socket.interface';

@Injectable()
export class MessageHandler {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private websocketService: WebsocketService,
  ) {}

  async handlePrivateMessage(
    client: AuthSocket,
    privateMessageDto: PrivateMessageDto,
  ): Promise<void> {
    const senderId = client.user!.id;

    console.log(
      `Processing message from ${senderId} to ${privateMessageDto.toUserId}`,
    );
    if (privateMessageDto.content.length > 500) {
      throw new Error('Message content exceeds 500 characters');
    }

    // 9. ChatService로 채팅방 조회/생성 (없으면 생성됨)
    const chat = await this.chatService.createOrGetChat(
      senderId,
      privateMessageDto.toUserId,
    );
    // 10. MessageService로 메시지 저장
    const message = await this.messageService.saveMessage(
      chat.chatId,
      senderId,
      privateMessageDto.toUserId,
      privateMessageDto.content,
    );

    // 11. 메시지 데이터 구성
    const messageData = {
      chatId: chat.chatId,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      content: message.content,
      timestamp: message.timestamp,
    };

    // 12. WebsocketService로 클라이언트에 'privateMessage' 이벤트 전송
    this.websocketService.broadcastEvent(
      'privateMessage',
      messageData,
      chat.participants,
    );

    console.log(`Message sent successfully from ${senderId}`);
  }
}
