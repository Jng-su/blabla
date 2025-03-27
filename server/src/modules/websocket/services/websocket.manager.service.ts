import { Injectable } from '@nestjs/common';
import { AuthSocket } from '../interface/auth-socket.interface';

@Injectable()
export class WebSocketManagerService {
  private clients = new Map<string, AuthSocket>();
  private server: any;

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

  // 모든 클라이언트에게 이벤트 전송
  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
