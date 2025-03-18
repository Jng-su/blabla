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

  async set(email: string, token: string, ttl?: number): Promise<void> {
    const key = `jwt:${email}`;
    if (ttl) {
      await this.redis.setex(key, ttl, token);
    } else {
      await this.redis.set(key, token);
    }
    this.logger.log(`✅ Token set for ${email}`);
  }

  async get(email: string): Promise<string | null> {
    return await this.redis.get(`jwt:${email}`);
  }

  async del(email: string): Promise<void> {
    const key = `jwt:${email}`;
    const result = await this.redis.del(key);
    if (result > 0) {
      this.logger.log(`🗑️ Token deleted for ${email}`);
    } else {
      this.logger.warn(`⚠️ No token found for ${email}`);
    }
  }

  onModuleDestroy() {
    this.redis.quit();
    this.logger.log('🔌 Redis connection closed');
  }
}
