import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FacilityDocument = HydratedDocument<Facility>;

@Schema({ timestamps: true, collection: 'facilities' })
export class Facility {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  createdAt: Date;
  updatedAt: Date;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);
