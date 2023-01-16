import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, concatMap, from, tap, throwError } from 'rxjs';
import { CreateOrderDto, GetOrderDto } from './entities/dtos';
import { Order, OrderDocument } from '@my-workspace/schemas';
import { MESSAGING_SERVICE_TOKEN } from './constants';

@Injectable()
export class AppService {
  private logger = new Logger('OrderService');
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @Inject(MESSAGING_SERVICE_TOKEN)
    private readonly messagingOperator: ClientProxy
  ) {}
  createOrder(payload: CreateOrderDto) {
    return from(
      this.messagingOperator.send('upsert_payment', payload.payment)
    ).pipe(
      tap((payment) => console.log('Payment Upsert result', payment)),
      concatMap(() =>
        from(this.orderModel.create(payload)).pipe(
          tap((order) => console.log('Order created', order))
        )
      ),
      catchError((err) => {
        this.logger.error(err);
        return throwError(() => new RpcException('Error creating order'));
      })
    );
    // return from(this.orderModel.create(payload)).pipe(
    //   catchError((err) => {
    //     this.logger.error(err);
    //     return throwError(() => new RpcException('Error creating order'));
    //   })
    // );
  }

  getOrder(payload: GetOrderDto) {
    return from(this.orderModel.findById(payload.id)).pipe(
      tap((order) => console.log('In here', order)),
      catchError((err) => {
        this.logger.error(err);
        return throwError(() => new RpcException('Error Fetching order'));
      })
    );
  }
}
