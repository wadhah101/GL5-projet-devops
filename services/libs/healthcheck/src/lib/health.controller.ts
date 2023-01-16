import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigFactory, ConfigFactoryKeyHost } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

export interface HealthControllerFactoryOptions {
  mongo: boolean;
  memory: boolean;
}
export const healthControllerFactory = (
  options: HealthControllerFactoryOptions
) => {
  @Controller('healthz')
  class HealthController {
    constructor(
      public health: HealthCheckService,
      public http: HttpHealthIndicator,
      public mongoose: MongooseHealthIndicator,
      public memory: MemoryHealthIndicator
    ) {}

    @Get()
    @HealthCheck()
    check() {
      const checks = [];
      if (options.memory) {
        checks.push(async () =>
          this.memory.checkHeap('memory_heap', 1024 * 1024 * 1024)
        );
      }
      if (options.mongo) {
        checks.push(async () => this.mongoose.pingCheck('mongoose'));
      }
      return this.health.check([
        () => this.http.pingCheck('http-alive', 'https://google.com'),
        ...checks,
      ]);
    }
  }
  return HealthController;
};
