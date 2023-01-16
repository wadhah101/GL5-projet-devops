import { Controller, Get, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { CreateOrderDto, GetOrderDto } from './entities/dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_order')
  createOrder(payload: CreateOrderDto) {
    return this.appService.createOrder(payload);
  }

  @MessagePattern('get_order')
  getOrder(payload: GetOrderDto) {
    return this.appService.getOrder(payload);
  }
}
