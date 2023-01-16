import { registerAs } from '@nestjs/config';
import Joi = require('joi');
import { validate } from '@my-workspace/config-helpers';

export interface GatewayConfig {
  APP_PORT: number;
  APP_HOST: string;
  ORDER_SERVICE_HOST: string;
  ORDER_SERVICE_PORT: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
}
export const gatewaySchema =
  process.env.ENV === 'dev'
    ? Joi.object<GatewayConfig>({
        APP_PORT: Joi.number().default(3001),
        APP_HOST: Joi.string().default('localhost'),
        ORDER_SERVICE_HOST: Joi.string().default('localhost'),
        ORDER_SERVICE_PORT: Joi.number().default(3004),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
      })
    : Joi.object<GatewayConfig>({
        APP_PORT: Joi.number().required(),
        APP_HOST: Joi.string().required(),
        ORDER_SERVICE_HOST: Joi.string().required(),
        ORDER_SERVICE_PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      });
export const gatewayCfgSymbol = '@my-workspace/gateway:config';
export const gatewayConfig = registerAs<GatewayConfig>(gatewayCfgSymbol, () =>
  validate(gatewaySchema)
);
