import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CityDocument = HydratedDocument<City>;

export enum CityType {
  KABUPATEN = 'kabupaten',
  KOTA = 'kota',
}

@Schema({ timestamps: true, collection: 'cities' })
export class City {
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ type: String, enum: CityType, required: true })
  type: CityType;

  @Prop({ type: Types.ObjectId, ref: 'Province', required: true, index: true })
  province: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const CitySchema = SchemaFactory.createForClass(City);
CitySchema.index({ province: 1, name: 1 });
