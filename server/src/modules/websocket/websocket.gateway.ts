import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat/entites/chat.entity';
import { Message } from '../message/entites/message.entity';

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
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, Socket>();

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async handleConnection(client: AuthSocket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload = await this.jwtService.verify(token);
      client.user = payload;
      this.clients.set(payload.id, client);
      console.log(
        `🟢 WebSocket: Client connected: ${client.id}, User ${payload.email}`,
      );
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthSocket) {
    const userId = client.user?.id || client.id;
    this.clients.delete(userId);
    console.log(
      `🔴 WebSocket: Client disconnected: ${client.id}, User ${userId}`,
    );
  }

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
    const receiverSocket = this.clients.get(payload.toUserId);
    const participants = [senderId, payload.toUserId].sort();
    const chatId = `personal-${participants.join('-')}`;

    // 채팅방 확인 및 생성
    let chat = await this.chatRepository.findOne({ where: { chatId } });
    if (!chat) {
      chat = new Chat();
      chat.chatId = chatId;
      chat.chatType = 'personal';
      chat.participants = participants;
      chat.name = payload.chatName || `${senderId}-${payload.toUserId}`;
      chat.image = payload.chatImage || null;
      await this.chatRepository.save(chat);

      participants.forEach((userId) => {
        const userSocket = this.clients.get(userId);
        if (userSocket) {
          userSocket.emit('chatCreated', {
            chatId,
            chatType: 'personal',
            participants,
            name: chat.name,
            image: chat.image,
          });
        }
      });
    }

    // 메시지 저장
    const message = new Message();
    message.chatId = chatId;
    message.chat = chat; // 관계 설정
    message.fromUserId = senderId;
    message.toUserId = payload.toUserId;
    message.content = payload.content;
    message.timestamp = new Date().toISOString();
    await this.messageRepository.save(message);

    // 실시간 전송
    if (receiverSocket) {
      receiverSocket.emit('privateMessage', message);
    }
    client.emit('privateMessage', message);
  }
}
