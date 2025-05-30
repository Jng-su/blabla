import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PingModule } from './modules/ping/ping.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FileModule } from './modules/file/file.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
    PingModule,
    RedisModule,
    AuthModule,
    UserModule,
    FileModule,
    WebsocketModule,
    ChatModule,
    MessageModule,
  ],
})
export class AppModule {
  constructor() {
    console.log(
      `🚀 Running Database Login as PostGres User: ${process.env.POSTGRES_USER}`,
    );
  }
}
