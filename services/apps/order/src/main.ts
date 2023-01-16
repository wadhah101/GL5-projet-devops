/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { orderCfgSymbol, OrderConfig } from './app/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = await app
    .get(ConfigService)
    .get<OrderConfig>(orderCfgSymbol);
  const { APP_HOST, APP_PORT } = appConfig;
  const ms = (await app).connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: `redis://${appConfig.REDIS_HOST}:${appConfig.REDIS_PORT}`,
    },
  });
  ms.listen().then(() =>
    Logger.log(
      `🚀 Microservice is exchanging messages on: redis://${appConfig.REDIS_HOST}:${appConfig.REDIS_PORT}`
    )
  );
  await app.listen(APP_PORT);
  Logger.log(`🚀 Application is running on: http://${APP_HOST}:${APP_PORT}`);
}

bootstrap();
