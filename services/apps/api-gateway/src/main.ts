/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { gatewayCfgSymbol, GatewayConfig } from './app/config';
import { winstonLoggerFactory } from '@my-workspace/loggers';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLoggerFactory({
      serviceName: 'api-gateway',
    }),
  });
  const config = await app
    .get(ConfigService)
    .get<GatewayConfig>(gatewayCfgSymbol);
  const { APP_HOST, APP_PORT } = config;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(APP_PORT);
  Logger.log(`🚀 Application is running on: http://${APP_HOST}:${APP_PORT}`);
}

bootstrap();
