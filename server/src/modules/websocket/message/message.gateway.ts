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
  cors: { origin: '*' },
})
export class MessageGateway {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private clientManager: SocketClientManager,
  ) {}

  @SubscribeMessage('createChat')
  @UseGuards(JwtAuthGuard)
  async handleCreateChat(
    client: AuthSocket,
    payload: {
      toUserId: string;
      chatType: string;
      chatName?: string;
      chatImage?: string;
    },
  ): Promise<void> {
    const senderId = client.user!.id;
    const chat = await this.chatService.createOrGetChat(
      senderId,
      payload.toUserId,
      payload.chatName,
      payload.chatImage,
    );

    // 생성자에게만 알림
    client.emit('chatCreated', {
      chatId: chat.chatId,
      chatType: chat.chatType,
      participants: chat.participants,
      name: chat.name,
      image: chat.image,
    });
  }

  @SubscribeMessage('privateMessage')
  @UseGuards(JwtAuthGuard)
  async handlePrivateMessage(
    client: AuthSocket,
    payload: {
      chatId: string;
      content: string;
    },
  ): Promise<void> {
    const senderId = client.user!.id;
    const senderUsername = client.user!.name;

    const chat = await this.chatService.getChatById(payload.chatId);
    if (!chat || !chat.participants.includes(senderId)) {
      throw new Error('Invalid chat or access denied');
    }

    const toUserId = chat.participants.find((id) => id !== senderId);
    if (!toUserId) {
      throw new Error('No recipient found in chat participants');
    }

    const message = await this.messageService.createMessage(
      chat.chatId,
      senderId,
      toUserId,
      payload.content,
      senderUsername,
    );

    const formattedMessage = {
      senderId: message.fromUserId,
      content: message.content,
      timestamp: new Date(message.timestamp),
      username: senderUsername,
    };

    const receiverSocket = this.clientManager.getClient(toUserId);
    if (receiverSocket) {
      receiverSocket.emit('messageReceived', formattedMessage, chat.chatId);

      // 첫 메시지일 경우 수신자에게 채팅 생성 알림
      const messages = await this.messageService.getMessagesByChatId(
        chat.chatId,
        toUserId,
      );
      if (messages.length === 1) {
        receiverSocket.emit('chatCreated', {
          chatId: chat.chatId,
          chatType: chat.chatType,
          participants: chat.participants,
          name: chat.name,
          image: chat.image,
        });
      }
    }
    client.emit('messageReceived', formattedMessage, chat.chatId);
  }
}
