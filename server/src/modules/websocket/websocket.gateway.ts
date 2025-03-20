import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(8001, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
      callback(null, allowedOrigin);
    },
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('🚀 WebSocket Server initialized');
  }

  handleConnection(client: any) {
    console.log('🟢 WebSocket : Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('🔴 WebSocket : Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: string): void {
    console.log('📩 Received message:', payload);
    if (payload === 'Hello') {
      client.emit('message', 'Hi back!');
    }
  }

  @SubscribeMessage('broadcast')
  handleBroadcast(client: any, payload: string): void {
    console.log('📩 Received broadcast:', payload, 'from client:', client.id);
    this.server.emit('message', `${client.id}: ${payload}`);
  }
}
