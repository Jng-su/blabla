import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { MessageModule } from '../message/message.module';
import { ChatHandler } from './handlers/chat.handler';
import { MessageHandler } from './handlers/message.handler';
import { WebSocketManagerService } from './services/websocket.manager.service';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './services/websocket.service';

@Module({
  imports: [AuthModule, ChatModule, MessageModule],
  providers: [
    WebsocketGateway,
    ChatHandler,
    MessageHandler,
    WebsocketService,
    WebSocketManagerService,
  ],
})
export class WebsocketModule {}
