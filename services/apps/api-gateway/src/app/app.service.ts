import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  catchError,
  finalize,
  map,
  of,
  retry,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { MESSAGING_SERVICE_TOKEN } from './constants';
import { CreateOrderDto, GetOrderDto } from './dtos/orders.dto';
import { TraceService } from '@my-workspace/opentelemetry';
import { Span } from 'nestjs-otel';

@Injectable()
export class AppService {
  private logger = new Logger('OrderService');
  constructor(
    @Inject(MESSAGING_SERVICE_TOKEN) private readonly orderService: ClientProxy,
    private readonly traceService: TraceService
  ) {}
  @Span()
  getOrder(payload: GetOrderDto) {
    const currentSpan = this.traceService.getSpan();
    currentSpan.addEvent('Order fetch request started');
    return of(this.traceService.startSpan('get_order')).pipe(
      switchMap((span) =>
        this.orderService.send('get_order', payload).pipe(
          tap((order) => {
            span.setAttributes({ order_id: order.id });
          }),
          retry(3),
          finalize(() => {
            span.end();
          })
        )
      ),
      finalize(() => {
        currentSpan.addEvent('Order creation request ended');
        currentSpan.end();
      })
    );
  }

  @Span()
  createOrder(payload: CreateOrderDto) {
    const currentSpan = this.traceService.getSpan();
    currentSpan.addEvent('Order creation request started');
    return of(this.traceService.startSpan('create_order')).pipe(
      switchMap((span) =>
        this.orderService.send('create_order', payload).pipe(
          tap((order) => {
            span.addEvent('order_id', order.id);
          }),
          retry(3),
          catchError((err) => {
            this.logger.error(err);
            return throwError(() => new RpcException('Error creating order'));
          }),
          finalize(() => {
            span.end();
          })
        )
      ),
      finalize(() => {
        currentSpan.addEvent('Order creation request ended');
        currentSpan.end();
      })
    );
  }
}
