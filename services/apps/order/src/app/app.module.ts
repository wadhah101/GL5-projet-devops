import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { orderConfig } from './config';
import { Order, OrderSchema } from '@my-workspace/schemas';
import {
  ClientProxyFactory,
  RedisOptions,
  Transport,
} from '@nestjs/microservices';
import { MESSAGING_SERVICE_TOKEN } from './constants';

@Module({
  imports: [
    ConfigModule.forFeature(orderConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(orderConfig)],
      inject: [orderConfig.KEY],
      useFactory: async (configService: ConfigType<typeof orderConfig>) => ({
        uri: configService.MONGO_URL,
      }),
    }),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: MESSAGING_SERVICE_TOKEN,
      inject: [orderConfig.KEY],
      useFactory: (configService: ConfigType<typeof orderConfig>) => {
        return ClientProxyFactory.create({
          transport: Transport.REDIS,
          options: {
            host: configService.REDIS_HOST,
          },
        });
      },
    },
  ],
})
export class AppModule {}
