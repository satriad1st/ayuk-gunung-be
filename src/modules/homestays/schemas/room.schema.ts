import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

export enum RoomType {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  FAMILY = 'family',
  DORM = 'dorm',
  SUITE = 'suite',
  PRIVATE = 'private',
}

export enum PriceType {
  FIXED = 'fixed',
  RANGE = 'range',
}

@Schema({ timestamps: true, collection: 'rooms' })
export class Room {
  @Prop({ type: Types.ObjectId, ref: 'Homestay', required: true, index: true })
  homestay: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: RoomType, required: true })
  type: RoomType;

  @Prop({ type: String, enum: PriceType, required: true })
  priceType: PriceType;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  priceMax?: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.index({ homestay: 1, name: 1 });
