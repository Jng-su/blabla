// src/modules/websocket/websocket.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WebsocketGateway {
  constructor(private readonly websocketService: WebsocketService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    const response = this.websocketService.processMessage(message);
    this.server.emit('message', response);
  }
}
