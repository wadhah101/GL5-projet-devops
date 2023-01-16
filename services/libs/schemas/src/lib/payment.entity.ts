import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type PaymentDocument = HydratedDocument<PaymentOption>;

@Schema()
export class PaymentOption {
  _id: ObjectId;

  @Prop()
  cardNumber: string;

  @Prop()
  cardHolder: string;

  @Prop()
  expirationDate: string;
}

export const PaymentOptionSchema = SchemaFactory.createForClass(PaymentOption);
