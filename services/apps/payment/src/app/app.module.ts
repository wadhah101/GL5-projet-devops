import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { paymentConfig } from './config';
import { PaymentOption, PaymentOptionSchema } from '@my-workspace/schemas';
import { HealthCheckModule } from '@my-workspace/healthcheck';
import { OpenTelModule } from '@my-workspace/opentelemetry';

@Module({
  imports: [
    HealthCheckModule.forRoot({
      memory: true,
      mongo: true,
    }),
    OpenTelModule,
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
