import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { CreateOrderDto, GetOrderDto } from './dtos/orders.dto';
import { OtelMethodCounter, Span } from 'nestjs-otel';
@Controller('order')
export class OrderController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @OtelMethodCounter()
  @Span()
  getOrder(@Body() payload: GetOrderDto) {
    return this.appService.getOrder(payload);
  }
  @Post()
  @OtelMethodCounter()
  createOrder(@Body() payload: CreateOrderDto) {
    return this.appService.createOrder(payload);
  }
}
