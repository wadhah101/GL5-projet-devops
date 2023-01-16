import { registerAs } from '@nestjs/config';
import { validate } from '@my-workspace/config-helpers';
import Joi = require('joi');

export interface PaymentConfig {
  APP_PORT: number;
  APP_HOST: string;
  REDIS_URL: string;
  MONGO_URL: string;
}

export const paymentSchema =
  process.env.ENV === 'dev'
    ? Joi.object<PaymentConfig>({
        APP_PORT: Joi.number().default(3002),
        APP_HOST: Joi.string().default('localhost'),
        REDIS_URL: Joi.string().default('redis://localhost:6379'),
        MONGO_URL: Joi.string().default('mongodb://localhost:27017/payment'),
      })
    : Joi.object<PaymentConfig>({
        APP_PORT: Joi.number().required(),
        APP_HOST: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        MONGO_URL: Joi.string().required(),
      });

export const paymentCfgSymbol = '@my-workspace/payment:config';
export const paymentConfig = registerAs<PaymentConfig>(paymentCfgSymbol, () =>
  validate(paymentSchema)
);
