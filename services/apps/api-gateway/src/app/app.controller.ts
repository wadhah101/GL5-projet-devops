import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { CreateOrderDto, GetOrderDto } from './dtos/orders.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@Body() payload: GetOrderDto) {
    return this.appService.getData(payload);
  }
  @Post()
  createOrder(@Body() payload: CreateOrderDto) {
    return this.appService.createOrder(payload);
  }
}
