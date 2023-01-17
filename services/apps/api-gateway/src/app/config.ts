import { registerAs } from '@nestjs/config';
import Joi = require('joi');
import { validate } from '@my-workspace/config-helpers';

export interface GatewayConfig {
  APP_PORT: number;
  APP_HOST: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  JEAGER_AGENT_HOST?: string;
  JEAGER_AGENT_PORT?: number;
  REDIS_PASSWORD?: string;
}
export const gatewaySchema =
  process.env.ENV === 'dev'
    ? Joi.object<GatewayConfig>({
        APP_PORT: Joi.number().default(3001),
        APP_HOST: Joi.string().default('localhost'),

        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
      })
    : Joi.object<GatewayConfig>({
        APP_PORT: Joi.number().default(80),
        APP_HOST: Joi.string().default('0.0.0.0'),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        JEAGER_AGENT_HOST: Joi.string().required(),
        JEAGER_AGENT_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
      });
export const gatewayCfgSymbol = '@my-workspace/gateway:config';
export const gatewayConfig = registerAs<GatewayConfig>(gatewayCfgSymbol, () =>
  validate(gatewaySchema)
);
