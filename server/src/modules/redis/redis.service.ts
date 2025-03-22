import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from '../../config/redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
    const config = redisConfig();
    this.redis = new Redis({
      host: config.host,
      port: config.port,
    });

    this.redis.on('connect', () => {
      console.log('🚀 Redis connected successfully');
    });

    this.redis.on('error', (err) => {
      console.error(`❌ Redis connection error: ${err.message}`);
    });

    this.redis.on('end', () => {
      console.warn('⚠️ Redis connection closed');
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
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(`${key}`);
  }

  async del(key: string): Promise<void> {
    const result = await this.redis.del(key);
    if (result > 0) {
      console.log(`🗑️ Key deleted: ${key}`);
    } else {
      console.warn(`⚠️ No key found for deletion: ${key}`);
    }
  }

  onModuleDestroy() {
    this.redis.quit();
    console.log('🔌 Redis connection closed');
  }
}
