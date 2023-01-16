import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDocument, PaymentOption } from '@my-workspace/schemas';
import { CreatePaymentOptionDTO } from './entities/payment.dto';
import {
  catchError,
  first,
  filter,
  from,
  startWith,
  tap,
  throwError,
  take,
  iif,
  map,
  finalize,
} from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Span } from 'nestjs-otel';
import { TraceService } from '@my-workspace/opentelemetry';

@Injectable()
export class AppService {
  logger = new Logger('PaymentService');

  constructor(
    @InjectModel(PaymentOption.name)
    private readonly paymentModel: Model<PaymentDocument>,
    private readonly traceService: TraceService
  ) {}
  @Span()
  async createPayment(payload: CreatePaymentOptionDTO) {
    const currentSpan = this.traceService.getSpan();
    return from(await this.paymentModel.find<PaymentOption>()).pipe(
      tap((c) =>
        currentSpan.addEvent(
          'Payment creation request started from the payment service',
          new Date()
        )
      ),
      filter(
        (paymentOption: PaymentOption) =>
          paymentOption.cardHolder === payload.cardHolder &&
          paymentOption.cardNumber === payload.cardNumber &&
          paymentOption.expirationDate === payload.expirationDate
      ),
      tap((paymentOption) => console.log('Payment option', paymentOption)),
      take(1),
      map((paymentOption: PaymentOption) => {
        return iif(
          () => {
            console.log('zzzz', paymentOption);
            return Object.keys(paymentOption).length === 0;
          },
          from(this.paymentModel.create(payload)).pipe(
            tap((payment) => console.log('Payment created', payment))
          ),
          from(this.paymentModel.updateOne(paymentOption, payload)).pipe(
            tap((payment) => console.log('Payment updated', payment))
          )
        );
      }),
      catchError((err) => {
        this.logger.error(err);
        return throwError(() => new RpcException('Error upserting payment'));
      }),
      finalize(() => {
        currentSpan.addEvent(
          'Order creation request ended from the payment service',
          new Date()
        );
        currentSpan.end();
      })
    );
  }
}
