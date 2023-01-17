/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { orderCfgSymbol, OrderConfig } from './app/config';
import { winstonLoggerFactory } from '@my-workspace/loggers';
import { otelSetup } from '@my-workspace/opentelemetry';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLoggerFactory({
      serviceName: 'order',
    }),
  });
  const appConfig = await app
    .get(ConfigService)
    .get<OrderConfig>(orderCfgSymbol);
  const {
    APP_HOST,
    APP_PORT,
    JEAGER_AGENT_HOST,
    JEAGER_AGENT_PORT,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
  } = appConfig;
  console.log('APP CONFIG \n', appConfig);

  const ms = (await app).connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
    },
  });
  await otelSetup({
    JeagerAgentHost: JEAGER_AGENT_HOST,
    JeagerAgentPort: JEAGER_AGENT_PORT,
    MetricsPort: 8080,
    serviceName: 'order',
  });
  ms.listen().then(() =>
    Logger.log(
      `🚀 Microservice is exchanging messages on: redis://10.0.255.226:${REDIS_PORT}/`
    )
  );
  await app.listen(APP_PORT);
  Logger.log(`🚀 Application is running on: http://${APP_HOST}:${APP_PORT}`);
}

bootstrap();
