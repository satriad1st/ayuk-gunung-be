import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BasecampDocument = HydratedDocument<Basecamp>;

export enum OvernightStay {
  CANNOT = 'cannot',
  MAYBE = 'maybe',
  CAN = 'can',
}

export enum TrashCheck {
  NONE = 'none',
  MAYBE = 'maybe',
  AVAILABLE = 'available',
}

export enum SimaksiType {
  ONLINE = 'online',
  ON_SITE = 'on_site',
}

export enum BasecampStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum BasecampOpenStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export enum OpenDaysType {
  EVERYDAY = 'everyday',
  CUSTOM = 'custom',
}

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

@Schema({ _id: false })
export class RouteSegment {
  @Prop({ required: true, trim: true })
  fromName: string;

  @Prop({ required: true, trim: true })
  toName: string;

  @Prop({ min: 0 })
  elevationGain?: number;

  @Prop({ min: 0 })
  distanceKm?: number;

  @Prop({ min: 0 })
  durationMinutesMin?: number;

  @Prop({ min: 0 })
  durationMinutesMax?: number;
}

export const RouteSegmentSchema = SchemaFactory.createForClass(RouteSegment);

@Schema({ timestamps: true, collection: 'basecamps' })
export class Basecamp {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ trim: true })
  contactName?: string;

  @Prop({ trim: true })
  contactPhone?: string;

  @Prop({ type: Types.ObjectId, ref: 'Mountain', required: true, index: true })
  mountain: Types.ObjectId;

  @Prop({ required: true, min: -90, max: 90 })
  latitude: number;

  @Prop({ required: true, min: -180, max: 180 })
  longitude: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ trim: true })
  gpxFile?: string;

  @Prop({ trim: true })
  gpxFileName?: string;

  @Prop({ type: String, enum: OvernightStay, required: true })
  overnightStay: OvernightStay;

  @Prop({ min: 0 })
  simaksiPrice?: number;

  @Prop({
    type: String,
    enum: SimaksiType,
    default: SimaksiType.ON_SITE,
  })
  simaksiType: SimaksiType;

  @Prop({ trim: true })
  simaksiRegistrationUrl?: string;

  @Prop({ type: String, enum: TrashCheck, required: true })
  trashCheck: TrashCheck;

  @Prop({
    type: String,
    enum: BasecampStatus,
    default: BasecampStatus.ACTIVE,
  })
  status: BasecampStatus;

  @Prop({
    type: String,
    enum: BasecampOpenStatus,
    default: BasecampOpenStatus.OPEN,
  })
  openStatus: BasecampOpenStatus;

  @Prop({
    type: String,
    enum: OpenDaysType,
    default: OpenDaysType.EVERYDAY,
  })
  openDaysType: OpenDaysType;

  @Prop({ type: [String], default: [] })
  openDays: string[];

  @Prop({ trim: true })
  openTimeFrom?: string;

  @Prop({ trim: true })
  openTimeTo?: string;

  @Prop({ default: false })
  tektokAllowed: boolean;

  @Prop({ trim: true })
  tektokDeadline?: string;

  @Prop({ min: 0 })
  elevationGain?: number;

  @Prop({ min: 0 })
  distanceKm?: number;

  @Prop({ min: 0 })
  durationHoursMin?: number;

  @Prop({ min: 0 })
  durationHoursMax?: number;

  @Prop({ type: [RouteSegmentSchema], default: [] })
  routeSegments: RouteSegment[];

  createdAt: Date;
  updatedAt: Date;
}

export const BasecampSchema = SchemaFactory.createForClass(Basecamp);
BasecampSchema.index({ name: 1, mountain: 1 });
