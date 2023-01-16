import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { CreatePaymentOptionDTO } from './entities/payment.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('upsert_payment')
  upsertPayment(payload: CreatePaymentOptionDTO) {
    console.log('here');
    return this.appService.createPayment(payload);
  }
}
