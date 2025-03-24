import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../chat/entites/chat.entity';
import { Message } from '../message/entites/message.entity';
import { ChatService } from '../chat/chat.service';
import { MessageService } from '../message/message.service';
import { ConnectionGateway } from './connection/connection.gateway';
import { MessageGateway } from './message/message.gateway';
import { SocketClientManager } from './connection/socket-client.manager';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Chat, Message])],
  providers: [
    ConnectionGateway,
    MessageGateway,
    ChatService,
    MessageService,
    SocketClientManager,
  ],
})
export class WebsocketModule {}
