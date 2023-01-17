import { registerAs } from '@nestjs/config';
import Joi = require('joi');
import { validate } from '@my-workspace/config-helpers';

export interface OrderConfig {
  APP_PORT: number;
  APP_HOST: string;
  MONGO_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  JEAGER_AGENT_HOST?: string;
  JEAGER_AGENT_PORT?: number;
  REDIS_PASSWORD?: string;
}
export const orderSchema =
  process.env.ENV === 'dev'
    ? Joi.object<OrderConfig>({
        APP_PORT: Joi.number().default(3003),
        APP_HOST: Joi.string().default('localhost'),
        MONGO_URL: Joi.string().default('mongodb://localhost:27017/order'),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
      })
    : Joi.object<OrderConfig>({
        APP_PORT: Joi.number().default(80),
        APP_HOST: Joi.string().default('0.0.0.0'),
        MONGO_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        JEAGER_AGENT_HOST: Joi.string().required(),
        JEAGER_AGENT_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
      });
export const orderCfgSymbol = '@my-workspace/order:config';
export const orderConfig = registerAs<OrderConfig>(orderCfgSymbol, () =>
  validate(orderSchema)
);
