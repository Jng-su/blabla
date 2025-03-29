import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<string>('BE_PORT') || 8000;
  const API_PREFIX = configService.get<string>('API_PREFIX') || 'api/v1';
  const NODE_ENV = configService.get<string>('NODE_ENV') || 'development';
  const FRONTEND_URL = configService.get<string>('FRONTEND_URL');

  app.enableCors({
    origin: FRONTEND_URL,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix(API_PREFIX);

  await app.listen(PORT, () => {
    console.log(
      `🚀 API running in "${NODE_ENV}" mode at: http://blabla-server:${PORT}/${API_PREFIX}`,
    );
  });
}
bootstrap();
