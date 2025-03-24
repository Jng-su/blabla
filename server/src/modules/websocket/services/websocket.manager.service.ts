import { Injectable } from '@nestjs/common';
import { AuthSocket } from '../interface/auth-socket.interface';

@Injectable()
export class WebSocketManagerService {
  private clients = new Map<string, AuthSocket>();

  // 클라이언트 추가
  addClient(userId: string, socket: AuthSocket): void {
    this.clients.set(userId, socket);
  }

  // 클라이언트 제거
  removeClient(userId: string): void {
    this.clients.delete(userId);
  }

  // 클라이언트 조회
  getClient(userId: string): AuthSocket | undefined {
    return this.clients.get(userId);
  }
}
