import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OpenTripDocument = HydratedDocument<OpenTrip>;

export enum OpenTripStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

@Schema({ _id: true })
export class OpenTripMeetingPoint {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  pricePerPerson: number;

  @Prop({ min: 0, default: 0 })
  suggestedDp: number;
}

export const OpenTripMeetingPointSchema =
  SchemaFactory.createForClass(OpenTripMeetingPoint);

@Schema({ timestamps: true, collection: 'open_trips' })
export class OpenTrip {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Mountain', required: true, index: true })
  mountain: Types.ObjectId;

  @Prop({ required: true, trim: true })
  mountainName: string;

  @Prop({ trim: true })
  mountainSlug?: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ trim: true })
  itinerary?: string;

  @Prop({ type: [String], default: [] })
  includes: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ type: [OpenTripMeetingPointSchema], default: [] })
  meetingPoints: OpenTripMeetingPoint[];

  @Prop({ trim: true, default: '' })
  meetingPoint: string;

  @Prop({ required: true, min: 1 })
  quota: number;

  @Prop({ min: 0, default: 0 })
  pricePerPerson: number;

  @Prop({ min: 0, default: 0 })
  suggestedDp: number;

  @Prop({ required: true, trim: true })
  whatsappPhone: string;

  @Prop({ trim: true })
  whatsappName?: string;

  @Prop({
    type: String,
    enum: OpenTripStatus,
    default: OpenTripStatus.DRAFT,
    index: true,
  })
  status: OpenTripStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const OpenTripSchema = SchemaFactory.createForClass(OpenTrip);

OpenTripSchema.index({ startDate: 1, status: 1 });
OpenTripSchema.index({ mountain: 1, status: 1, startDate: 1 });
OpenTripSchema.index({ name: 'text' });
OpenTripSchema.index({ 'meetingPoints.name': 1 });
