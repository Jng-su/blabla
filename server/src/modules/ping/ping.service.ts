import { Injectable } from '@nestjs/common';

@Injectable()
export class PingService {
  getPingResponse(): string {
    return 'Pong 🏓';
  }
}
