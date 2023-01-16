import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, retry, tap, throwError } from 'rxjs';
import { MESSAGING_SERVICE_TOKEN } from './constants';
import { CreateOrderDto, GetOrderDto } from './dtos/orders.dto';

@Injectable()
export class AppService {
  private logger = new Logger('OrderService');
  constructor(
    @Inject(MESSAGING_SERVICE_TOKEN) private readonly orderService: ClientProxy
  ) {}
  getData(payload: GetOrderDto) {
    return this.orderService.send('get_order', payload).pipe(
      tap((order) =>
        this.logger.verbose('Order created: ' + JSON.stringify(order))
      ),
      retry(3)
    );
  }
  createOrder(payload: CreateOrderDto) {
    return this.orderService.send('create_order', payload).pipe(
      tap((order) =>
        this.logger.verbose('Order created: ' + JSON.stringify(order))
      ),
      retry(3),
      catchError((err) => {
        this.logger.error(err);
        return throwError(() => new RpcException('Error creating order'));
      })
    );
  }
}
