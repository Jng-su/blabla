import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  providers: [WebsocketService, WebsocketGateway],
  exports: [WebsocketService],
})
export class WebsocketModule {}
