import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { HydratedDocument, ObjectId } from 'mongoose';
import { PaymentOption, PaymentOptionSchema } from './payment.entity';

export type OrderDocument = HydratedDocument<Order>;
@Schema()
export class Order {
  _id: ObjectId;
  @Prop()
  name: string;
  @Prop()
  price: number;
  @Prop()
  quantity: number;
  @Prop()
  status: string;

  @Prop({ type: PaymentOptionSchema })
  @Type(() => PaymentOption)
  payment: PaymentOption;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
