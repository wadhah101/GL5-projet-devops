import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  catchError,
  concatMap,
  finalize,
  from,
  of,
  tap,
  throwError,
} from 'rxjs';
import { CreateOrderDto, GetOrderDto } from './entities/dtos';
import { Order, OrderDocument } from '@my-workspace/schemas';
import { MESSAGING_SERVICE_TOKEN } from './constants';
import { Span } from 'nestjs-otel';
import { TraceService } from '@my-workspace/opentelemetry';

@Injectable()
export class AppService {
  private logger = new Logger('OrderService');
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @Inject(MESSAGING_SERVICE_TOKEN)
    private readonly messagingOperator: ClientProxy,
    private readonly traceService: TraceService
  ) {}
  @Span()
  createOrder(payload: CreateOrderDto) {
    const currentSpan = this.traceService.getSpan();
    currentSpan.addEvent(
      'Order creation request started from the order service'
    );
    return of(this.traceService.startSpan('create_order')).pipe(
      concatMap((span) =>
        from(
          this.messagingOperator.send('upsert_payment', payload.payment)
        ).pipe(
          tap((payment) => {
            span.addEvent(
              'Sent payment request hop to order service for payment_id: ',
              payment.id,
              new Date()
            );
          }),
          concatMap(() =>
            from(this.orderModel.create(payload)).pipe(
              tap((order) => {
                span.addEvent(
                  'Finished persisting order for order_id: ',
                  order.id,
                  new Date()
                );
              }),
              finalize(() => {
                span.end();
              })
            )
          ),
          catchError((err) => {
            this.logger.error(err);
            return throwError(
              () => new RpcException(`Error creating order: ${err}`)
            );
          }),
          finalize(() => {
            currentSpan.addEvent(
              'Order creation request ended from the order service',
              new Date()
            );
            currentSpan.end();
          })
        )
      )
    );
  }

  @Span()
  getOrder(payload: GetOrderDto) {
    const currentSpan = this.traceService.getSpan();
    currentSpan.addEvent('Order fetch request started from the order service');
    return of(this.traceService.startSpan('get_order')).pipe(
      concatMap((span) =>
        from(this.orderModel.findById(payload.id)).pipe(
          tap((order) =>
            span.addEvent(
              'Finished fetching order for order_id',
              payload.id,
              new Date()
            )
          ),
          finalize(() => span.end()),
          catchError((err) => {
            this.logger.error(err);
            return throwError(() => new RpcException('Error Fetching order'));
          })
        )
      ),
      finalize(() => {
        currentSpan.addEvent(
          'Order fetch request ended from the order service',
          new Date()
        );
        currentSpan.end();
      })
    );
  }
}
