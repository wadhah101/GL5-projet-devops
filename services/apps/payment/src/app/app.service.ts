import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDocument, PaymentOption } from '@my-workspace/schemas';
import { CreatePaymentOptionDTO } from './entities/payment.dto';
import {
  catchError,
  filter,
  from,
  tap,
  throwError,
  take,
  iif,
  map,
  finalize,
  startWith,
  reduce,
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
      startWith({}),
      tap((c) => {
        console.log(c);
        currentSpan.addEvent(
          'Payment creation request started from the payment service',
          new Date()
        );
        this.logger.debug('Payment fetched from mongo');
        console.log('Payment fetched from mongo');
      }),
      reduce((val: PaymentOption, paymentOption) => {
        if (
          (paymentOption.cardHolder === payload.cardHolder &&
            paymentOption.cardNumber === payload.cardNumber &&
            paymentOption.expirationDate === payload.expirationDate) === true
        ) {
          return paymentOption;
        } else return {};
      }),
      map((paymentOption: PaymentOption) => {
        const subSpan = this.traceService.startSpan('upsert_payment');
        return iif(
          () => {
            console.log('checking IF STATEMENT');
            return Object.keys(paymentOption).length === 0;
          },
          from(this.paymentModel.create(payload)).pipe(
            tap((payment) => {
              this.logger.debug('Payment persisted successfully');
              console.log('Payment persisted successfully');
              subSpan.addEvent(
                'Payment was not found, Finished persisting payment for payment_id: ',
                payment.id,
                new Date()
              );
            })
          ),
          from(this.paymentModel.updateOne(paymentOption, payload)).pipe(
            tap(() => {
              this.logger.debug('Payment updated successfully');
              console.log('Payment updated successfully');
              subSpan.addEvent(
                'Payment was found, Finished updating payment for payment_id: ',
                new Date()
              );
            })
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
