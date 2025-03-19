import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from '../../config/redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    const config = redisConfig();
    this.redis = new Redis({
      host: config.host,
      port: config.port,
    });

    this.redis.on('connect', () => {
      this.logger.log('🚀 Redis connected successfully');
    });

    this.redis.on('error', (err) => {
      this.logger.error(`❌ Redis connection error: ${err.message}`);
    });

    this.redis.on('end', () => {
      this.logger.warn('⚠️ Redis connection closed');
    });
  }

  async set(
    email: string,
    access_token: string,
    refresh_token: string,
    accessTokenTTL: number,
    refreshTokenTTL: number,
  ): Promise<void> {
    const accessKey = `access_token:${email}`;
    const refreshKey = `refresh_token:${email}`;
    await this.redis.setex(accessKey, accessTokenTTL, access_token);
    await this.redis.setex(refreshKey, refreshTokenTTL, refresh_token);
    this.logger.log(`✅ Tokens set for ${email}`);
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(`${key}`);
  }

  async del(key: string): Promise<void> {
    const result = await this.redis.del(key);
    if (result > 0) {
      this.logger.log(`🗑️ Key deleted: ${key}`);
    } else {
      this.logger.warn(`⚠️ No key found for deletion: ${key}`);
    }
  }

  onModuleDestroy() {
    this.redis.quit();
    this.logger.log('🔌 Redis connection closed');
  }
}
