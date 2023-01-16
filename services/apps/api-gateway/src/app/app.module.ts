import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { OrderController } from './app.controller';
import { AppService } from './app.service';
import { gatewayConfig } from './config';
import { MESSAGING_SERVICE_TOKEN } from './constants';

@Module({
  imports: [ConfigModule.forFeature(gatewayConfig)],
  controllers: [OrderController],
  providers: [
    AppService,
    {
      provide: MESSAGING_SERVICE_TOKEN,
      inject: [gatewayConfig.KEY],
      useFactory: (configService: ConfigType<typeof gatewayConfig>) => {
        return ClientProxyFactory.create({
          transport: Transport.REDIS,
          options: {
            host: configService.REDIS_HOST,
            port: configService.REDIS_PORT,
          },
        });
      },
    },
  ],
})
export class AppModule {}
