import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AuthSocket } from './interface/auth-socket.interface';
import { WebSocketManagerService } from './services/websocket.manager.service';
import { ChatHandler } from './handlers/chat.handler';
import { MessageHandler } from './handlers/message.handler';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrivateMessageDto } from './dto/private-message.dto';

@Injectable()
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

  constructor(
    private jwtService: JwtService,
    private webSocketManager: WebSocketManagerService,
    private chatHandler: ChatHandler,
    private messageHandler: MessageHandler,
  ) {}

  // 클라이언트 연결 시 호출
  async handleConnection(client: AuthSocket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect();
      console.log(`🔴 WebSocket: Client disconnected: ${client.id} (no token)`);
      return;
    }
    try {
      const payload = await this.jwtService.verify(token);
      client.user = payload;
      this.webSocketManager.addClient(payload.id, client);
      console.log(
        `🟢 WebSocket: Client connected: ${client.id}, User: ${payload.email}`,
      );
    } catch (error) {
      client.disconnect();
    }
  }

  // 클라이언트 연결 해제 시 호출
  handleDisconnect(client: AuthSocket) {
    const userId = client.user?.id || client.id;
    this.webSocketManager.removeClient(userId);
    console.log(
      `🔴 WebSocket: Client disconnected: ${client.id}, User: ${userId}`,
    );
  }

  // 클라이언트로부터 메시지 수신 시 호출
  @SubscribeMessage('createChat')
  async onCreateChat(client: AuthSocket, createChatDto: CreateChatDto) {
    await this.chatHandler.handleCreateChat(client, createChatDto);
  }

  // 클라이언트로부터 메시지 수신 시 호출
  @SubscribeMessage('privateMessage')
  async onPrivateMessage(
    client: AuthSocket,
    privateMessageDto: PrivateMessageDto,
  ) {
    await this.messageHandler.handlePrivateMessage(client, privateMessageDto);
  }
}
