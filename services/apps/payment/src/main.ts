/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { paymentCfgSymbol, PaymentConfig } from './app/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = await app
    .get(ConfigService)
    .get<PaymentConfig>(paymentCfgSymbol);
  const { APP_HOST, APP_PORT } = appConfig;
  const ms = (await app).connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: appConfig.REDIS_URL.match(/redis:\/\/(.*)/)[1],
    },
  });
  ms.listen().then(() =>
    Logger.log(
      `🚀 Microservice is exchanging messages on: ${appConfig.REDIS_URL}`
    )
  );
  await app.listen(APP_PORT);
  Logger.log(`🚀 Application is running on: http://${APP_HOST}:${APP_PORT}`);
}

bootstrap();
