import { DynamicModule, Global, Module } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { TraceService } from './trace.service';

export interface OpenTelemetryModuleOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiMetricsAttributes: Attributes;
}
export interface Attributes {
  [attributeKey: string]: AttributeValue | undefined;
}

export declare type AttributeValue =
  | string
  | number
  | boolean
  | Array<null | undefined | string>
  | Array<null | undefined | number>
  | Array<null | undefined | boolean>;

@Global()
@Module({
  providers: [TraceService],
  exports: [TraceService],
})
export class OpenTelModule {
  static forRoot(options?: OpenTelemetryModuleOptions): DynamicModule {
    return {
      module: OpenTelModule,
      imports: [
        OpenTelemetryModule.forRoot({
          metrics: {
            hostMetrics: true,
            apiMetrics: {
              enable: true,
              defaultAttributes: {
                ...options.apiMetricsAttributes,
              },
              ignoreUndefinedRoutes: false,
            },
          },
        }),
      ],
      providers: [TraceService],
      exports: [TraceService],
    };
  }
}
