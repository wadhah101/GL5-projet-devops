import { DynamicModule, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import {
  healthControllerFactory,
  HealthControllerFactoryOptions,
} from './health.controller';
@Module({})
export class HealthCheckModule {
  static forRoot(options: HealthControllerFactoryOptions) {
    return {
      module: HealthCheckModule,
      controllers: [healthControllerFactory(options)],
      imports: [TerminusModule, HttpModule],
    };
  }
}
