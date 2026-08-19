import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HomestayDocument = HydratedDocument<Homestay>;

export enum HomestayStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum RentalType {
  ROOM = 'room',
  PERSON = 'person',
  HOUSE = 'house',
}

@Schema({ timestamps: true, collection: 'homestays' })
export class Homestay {
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

  @Prop({
    type: String,
    enum: RentalType,
    default: RentalType.ROOM,
  })
  rentalType: RentalType;

  @Prop({ type: Types.ObjectId, ref: 'Province', required: true, index: true })
  province: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true, index: true })
  city: Types.ObjectId;

  @Prop({ required: true, min: -90, max: 90 })
  latitude: number;

  @Prop({ required: true, min: -180, max: 180 })
  longitude: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Mountain' }], default: [] })
  mountains: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Facility' }], default: [] })
  facilities: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: true, index: true })
  owner: Types.ObjectId;

  @Prop({
    type: String,
    enum: HomestayStatus,
    default: HomestayStatus.ACTIVE,
  })
  status: HomestayStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const HomestaySchema = SchemaFactory.createForClass(Homestay);
HomestaySchema.index({ name: 1, city: 1 });
