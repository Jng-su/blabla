import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway(8001)
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private configService: ConfigService) {}

  afterInit() {
    const allowedOrigin = this.configService.get<string>('FRONTEND_URL');
    this.server = new Server({
      cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST'],
      },
    });
    console.log('🚀 WebSocket Server initialized with origin:', allowedOrigin);
  }

  handleConnection(client: any) {
    console.log('🟢 WebSocket : Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('🔴 WebSocket : Client disconnected:', client.id);
  }
}
