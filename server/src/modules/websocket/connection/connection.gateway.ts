import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { SocketClientManager } from './socket-client.manager';

interface AuthSocket extends Socket {
  user?: { id: string; email: string; name: string; role: string };
}

@Injectable()
@WebSocketGateway(8001, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
      callback(null, allowedOrigin);
    },
  },
})
export class ConnectionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private clientManager: SocketClientManager,
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
      this.clientManager.addClient(payload.id, client);
      console.log(
        `🟢 WebSocket: Client connected: ${client.id}, User ${payload.email}`,
      );
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthSocket) {
    const userId = client.user?.id || client.id;
    this.clientManager.removeClient(userId);
    console.log(
      `🔴 WebSocket: Client disconnected: ${client.id}, User ${userId}`,
    );
  }
}
