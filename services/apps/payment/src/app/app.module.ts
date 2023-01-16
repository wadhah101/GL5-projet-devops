import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { paymentConfig } from './constants';
import { PaymentOption, PaymentOptionSchema } from '@my-workspace/schemas';

@Module({
  imports: [
    ConfigModule.forFeature(paymentConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(paymentConfig)],
      inject: [paymentConfig.KEY],
      useFactory: async (configService: ConfigType<typeof paymentConfig>) => ({
        uri: configService.MONGO_URL,
      }),
    }),
    MongooseModule.forFeature([
      {
        name: PaymentOption.name,
        schema: PaymentOptionSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
