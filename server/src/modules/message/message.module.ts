import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entites/message.entity';
import { Chat } from '../chat/entites/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Chat])],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
