import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MountainDocument = HydratedDocument<Mountain>;

export enum MountainStatus {
  ACTIVE = 'active',
  ALERT = 'alert',
  INACTIVE = 'inactive',
}

export enum MountainType {
  VOLCANO = 'volcano',
  NON_VOLCANO = 'non_volcano',
}

export enum HikingStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export const PUBLIC_MOUNTAIN_STATUSES = [
  MountainStatus.ACTIVE,
  MountainStatus.ALERT,
  MountainStatus.INACTIVE,
] as const;

@Schema({ timestamps: true, collection: 'mountains' })
export class Mountain {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ default: '', trim: true })
  description: string;

  @Prop({ required: true, min: 1 })
  elevation: number;

  @Prop({ type: Types.ObjectId, ref: 'Province', required: true, index: true })
  province: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true, index: true })
  city: Types.ObjectId;

  @Prop({ required: true, min: -90, max: 90 })
  latitude: number;

  @Prop({ required: true, min: -180, max: 180 })
  longitude: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    type: String,
    enum: MountainType,
    default: MountainType.NON_VOLCANO,
    index: true,
  })
  type: MountainType;

  @Prop({
    type: String,
    enum: MountainStatus,
    default: MountainStatus.ACTIVE,
  })
  status: MountainStatus;

  @Prop({
    type: String,
    enum: HikingStatus,
    default: HikingStatus.OPEN,
  })
  hikingStatus: HikingStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const MountainSchema = SchemaFactory.createForClass(Mountain);
MountainSchema.index({ name: 'text', description: 'text' });
