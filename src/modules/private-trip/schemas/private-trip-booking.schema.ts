import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TRIP_PACKAGE_KEYS } from './private-trip.schema';

export type PrivateTripBookingDocument = HydratedDocument<PrivateTripBooking>;

export const TRIP_TYPES = TRIP_PACKAGE_KEYS;
export type TripType = (typeof TRIP_TYPES)[number];

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
}

export enum PaymentMethod {
  TRANSFER = 'transfer',
  CASH = 'cash',
  QRIS = 'qris',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class TripPayment {
  @Prop({ required: true, min: 1 })
  amount: number;

  @Prop({ required: true })
  paidAt: Date;

  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.TRANSFER,
  })
  method: PaymentMethod;

  @Prop({ trim: true })
  note?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TripPaymentSchema = SchemaFactory.createForClass(TripPayment);

@Schema({ timestamps: true, collection: 'private_trip_bookings' })
export class PrivateTripBooking {
  @Prop({ required: true, trim: true })
  customerName: string;

  @Prop({ required: true, trim: true })
  customerPhone: string;

  @Prop({ trim: true, lowercase: true })
  customerEmail?: string;

  @Prop({ required: true, min: 1 })
  pax: number;

  @Prop({ type: Types.ObjectId, ref: 'Mountain', required: true, index: true })
  mountain: Types.ObjectId;

  @Prop({ required: true, trim: true })
  mountainName: string;

  @Prop({ required: true, type: String, enum: TRIP_TYPES })
  tripType: TripType;

  @Prop({ required: true, min: 1 })
  days: number;

  @Prop({ required: true, min: 0 })
  nights: number;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ required: true, min: 0 })
  pricePerPerson: number;

  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ required: true, min: 0, default: 0 })
  discount: number;

  @Prop({ required: true, min: 0 })
  finalPrice: number;

  @Prop({ trim: true })
  notes?: string;

  @Prop({ type: [TripPaymentSchema], default: [] })
  payments: TripPayment[];

  @Prop({ required: true, min: 0, default: 0 })
  paidAmount: number;

  @Prop({ required: true, min: 0, default: 0 })
  remainingAmount: number;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
    index: true,
  })
  paymentStatus: PaymentStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const PrivateTripBookingSchema =
  SchemaFactory.createForClass(PrivateTripBooking);

PrivateTripBookingSchema.index({ startDate: 1, endDate: 1 });
PrivateTripBookingSchema.index({ customerName: 1 });
PrivateTripBookingSchema.index({ customerPhone: 1 });
