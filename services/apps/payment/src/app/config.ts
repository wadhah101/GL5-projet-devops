import { registerAs } from '@nestjs/config';
import { validate } from '@my-workspace/config-helpers';
import Joi = require('joi');

export interface PaymentConfig {
  APP_PORT: number;
  APP_HOST: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  MONGO_URL: string;
  JEAGER_AGENT_HOST?: string;
  JEAGER_AGENT_PORT?: number;
  REDIS_PASSWORD?: string;
}

export const paymentSchema =
  process.env.ENV === 'dev'
    ? Joi.object<PaymentConfig>({
        APP_PORT: Joi.number().default(3002),
        APP_HOST: Joi.string().default('localhost'),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        MONGO_URL: Joi.string().default('mongodb://localhost:27017/payment'),
      })
    : Joi.object<PaymentConfig>({
        APP_PORT: Joi.number().required(),
        APP_HOST: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        MONGO_URL: Joi.string().required(),
        JEAGER_AGENT_HOST: Joi.string().required(),
        JEAGER_AGENT_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
      });

export const paymentCfgSymbol = '@my-workspace/payment:config';
export const paymentConfig = registerAs<PaymentConfig>(paymentCfgSymbol, () =>
  validate(paymentSchema)
);
