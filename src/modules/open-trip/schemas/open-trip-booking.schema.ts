import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OpenTripBookingDocument = HydratedDocument<OpenTripBooking>;

export enum ParticipantGender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum OpenTripBookingStatus {
  INQUIRY = 'inquiry',
  BOOKING = 'booking',
  DP = 'dp',
  PAID = 'paid',
}

export enum OpenTripPaymentChannel {
  ADMIN = 'admin',
  GATEWAY = 'gateway',
}

export enum OpenTripPaymentMethod {
  TRANSFER = 'transfer',
  CASH = 'cash',
  QRIS = 'qris',
  OTHER = 'other',
}

export const OCCUPYING_BOOKING_STATUSES = [
  OpenTripBookingStatus.BOOKING,
  OpenTripBookingStatus.DP,
  OpenTripBookingStatus.PAID,
] as const;

@Schema({ timestamps: true })
export class OpenTripParticipant {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ type: String, enum: ParticipantGender, required: true })
  gender: ParticipantGender;

  @Prop({ required: true })
  birthDate: string;
}

export const OpenTripParticipantSchema =
  SchemaFactory.createForClass(OpenTripParticipant);

@Schema({ timestamps: true })
export class OpenTripPayment {
  @Prop({ required: true, min: 1 })
  amount: number;

  @Prop({ required: true })
  paidAt: Date;

  @Prop({
    type: String,
    enum: OpenTripPaymentMethod,
    default: OpenTripPaymentMethod.TRANSFER,
  })
  method: OpenTripPaymentMethod;

  @Prop({ trim: true })
  note?: string;
}

export const OpenTripPaymentSchema =
  SchemaFactory.createForClass(OpenTripPayment);

@Schema({ _id: false })
export class OpenTripAddon {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const OpenTripAddonSchema = SchemaFactory.createForClass(OpenTripAddon);

@Schema({ timestamps: true, collection: 'open_trip_bookings' })
export class OpenTripBooking {
  @Prop({ type: Types.ObjectId, ref: 'OpenTrip', required: true, index: true })
  openTrip: Types.ObjectId;

  @Prop({ required: true, trim: true })
  openTripName: string;

  @Prop({ required: true, trim: true })
  mountainName: string;

  @Prop({ required: true })
  tripStartDate: string;

  @Prop({ required: true })
  tripEndDate: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  bookerName: string;

  @Prop({ required: true, trim: true })
  bookerPhone: string;

  @Prop({ trim: true, lowercase: true })
  bookerEmail?: string;

  @Prop({ trim: true })
  meetingPointId?: string;

  @Prop({ required: true, trim: true })
  meetingPoint: string;

  @Prop({ trim: true })
  meetingGatherDate?: string;

  @Prop({ trim: true })
  meetingGatherTime?: string;

  @Prop({ min: 0, default: 0 })
  pricePerPerson: number;

  @Prop({ required: true, min: 1 })
  pax: number;

  @Prop({ type: [OpenTripParticipantSchema], default: [] })
  participants: OpenTripParticipant[];

  @Prop({ type: [OpenTripAddonSchema], default: [] })
  addons: OpenTripAddon[];

  @Prop({ min: 0, default: 0 })
  addonTotal: number;

  @Prop({
    type: String,
    enum: OpenTripPaymentChannel,
    default: OpenTripPaymentChannel.ADMIN,
  })
  paymentChannel: OpenTripPaymentChannel;

  @Prop({
    type: String,
    enum: OpenTripBookingStatus,
    default: OpenTripBookingStatus.INQUIRY,
    index: true,
  })
  bookingStatus: OpenTripBookingStatus;

  @Prop({ required: true, min: 0 })
  finalPrice: number;

  @Prop({ required: true, min: 0, default: 0 })
  paidAmount: number;

  @Prop({ required: true, min: 0, default: 0 })
  remainingAmount: number;

  @Prop({ type: [OpenTripPaymentSchema], default: [] })
  payments: OpenTripPayment[];

  @Prop({ trim: true })
  notes?: string;

  @Prop({ trim: true, default: 'admin' })
  source: 'web' | 'admin';

  createdAt: Date;
  updatedAt: Date;
}

export const OpenTripBookingSchema =
  SchemaFactory.createForClass(OpenTripBooking);

OpenTripBookingSchema.index({ bookerEmail: 1, createdAt: -1 });
OpenTripBookingSchema.index({ user: 1, createdAt: -1 });
OpenTripBookingSchema.index({ openTrip: 1, bookingStatus: 1 });
OpenTripBookingSchema.index({ tripStartDate: 1, bookingStatus: 1 });
