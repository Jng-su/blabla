import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PingModule } from './modules/ping/ping.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

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
  ],
})
export class AppModule {
  constructor() {
    console.log(
      `🚀 Running Database Login as PostGres User: ${process.env.POSTGRES_USER}`,
    );
  }
}
