import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsocketService {
  processMessage(message: string): string {
    return `Processed: ${message}`;
  }
}
