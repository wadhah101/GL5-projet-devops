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
const otelSDKFactory = (config: {
  JeagerAgentHost: string;
  JeagerAgentPort: number;
}) =>
  new NodeSDK({
    metricReader: new PrometheusExporter({
      port: 8080,
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
    instrumentations: [getNodeAutoInstrumentations()],
  });

export const otelSetup = async (
  config: {
    JeagerAgentHost: string;
    JeagerAgentPort: number;
  } = { JeagerAgentHost: 'localhost', JeagerAgentPort: 6832 }
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
