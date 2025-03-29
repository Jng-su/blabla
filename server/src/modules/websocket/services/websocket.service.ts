import { Injectable } from '@nestjs/common';
import { WebSocketManagerService } from './websocket.manager.service';

@Injectable()
export class WebsocketService {
  constructor(private webSocketManager: WebSocketManagerService) {}

  broadcastEvent(eventName: string, data: any, participants: string[]): void {
    participants.forEach((userId) => {
      const userSocket = this.webSocketManager.getClient(userId);
      if (userSocket) {
        userSocket.emit(eventName, data);
      }
    });
  }
}
