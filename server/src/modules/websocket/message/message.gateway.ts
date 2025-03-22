import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { ChatService } from '../../chat/chat.service';
import { MessageService } from '../../message/message.service';
import { SocketClientManager } from '../connection/socket-client.manager';

interface AuthSocket extends Socket {
  user?: { id: string; email: string; name: string; role: string };
}

@WebSocketGateway(8001, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
      callback(null, allowedOrigin);
    },
  },
})
export class MessageGateway {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private clientManager: SocketClientManager,
  ) {}

  @SubscribeMessage('privateMessage')
  @UseGuards(JwtAuthGuard)
  async handlePrivateMessage(
    client: AuthSocket,
    payload: {
      toUserId: string;
      content: string;
      chatName?: string;
      chatImage?: string;
    },
  ): Promise<void> {
    const senderId = client.user!.id;
    const receiverSocket = this.clientManager.getClient(payload.toUserId);

    const chat = await this.chatService.createOrGetChat(
      senderId,
      payload.toUserId,
      payload.chatName,
      payload.chatImage,
    );

    const message = await this.messageService.createMessage(
      chat.chatId,
      senderId,
      payload.toUserId,
      payload.content,
    );

    if (receiverSocket) {
      receiverSocket.emit('privateMessage', message);
    }
    client.emit('privateMessage', message);

    if (message.id === message.chat.messages[0]?.id) {
      chat.participants.forEach((userId) => {
        const userSocket = this.clientManager.getClient(userId);
        if (userSocket) {
          userSocket.emit('chatCreated', {
            chatId: chat.chatId,
            chatType: chat.chatType,
            participants: chat.participants,
            name: chat.name,
            image: chat.image,
          });
        }
      });
    }
  }
}
