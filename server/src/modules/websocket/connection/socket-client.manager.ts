import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketClientManager {
  private clients = new Map<string, Socket>();

  addClient(userId: string, socket: Socket): void {
    this.clients.set(userId, socket);
  }

  removeClient(userId: string): void {
    this.clients.delete(userId);
  }

  getClient(userId: string): Socket | undefined {
    return this.clients.get(userId);
  }
}
