import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entites/chat.entity';
import { ChatController } from './chat.controller';
import { User } from '../user/entites/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  controllers: [ChatController],
  providers: [ChatService, UserService],
  exports: [ChatService],
})
export class ChatModule {}
