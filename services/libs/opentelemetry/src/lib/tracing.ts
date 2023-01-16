import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { BasicTracerProvider } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

const otelSDKFactory = (config: {
  JeagerAgentHost: string;
  JeagerAgentPort: number;
  serviceName: string;
  MetricsPort?: number;
}) => {
  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
    }),
  });
  provider.addSpanProcessor(new BatchSpanProcessor(new JaegerExporter()));
  provider.register();
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  return new NodeSDK({
    serviceName: config.serviceName,
    metricReader: new PrometheusExporter({
      endpoint: '/metrics',
      port: config.MetricsPort,
    }),
    traceExporter: new JaegerExporter({
      port: config.JeagerAgentPort,
      host: config.JeagerAgentHost,
    }),
    spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
    contextManager: new AsyncLocalStorageContextManager(),
    textMapPropagator: new CompositePropagator({
      propagators: [
        new JaegerPropagator(),
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
        new B3Propagator(),
        new B3Propagator({
          injectEncoding: B3InjectEncoding.MULTI_HEADER,
        }),
      ],
    }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new WinstonInstrumentation(),
      new RedisInstrumentation(),
      new MongoDBInstrumentation(),
      new NestInstrumentation(),
      new ExpressInstrumentation(),
    ],
  });
};

export const otelSetup = async (
  config: {
    JeagerAgentHost: string;
    JeagerAgentPort: number;
    serviceName: string;
    MetricsPort?: number;
  } = {
    JeagerAgentHost: 'localhost',
    JeagerAgentPort: 6832,
    serviceName: 'unknown',
  }
) => {
  const otelsdk = otelSDKFactory(config);
  await otelsdk.start();
  process.on('SIGTERM', () => {
    otelsdk.shutdown().then(
      () => console.log('OpenTelemetry shutdown complete'),
      (err) => console.error('OpenTelemetry shutdown error', err)
    );
  });
};
