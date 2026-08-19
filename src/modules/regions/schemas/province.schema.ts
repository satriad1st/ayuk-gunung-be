import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProvinceDocument = HydratedDocument<Province>;

@Schema({ timestamps: true, collection: 'provinces' })
export class Province {
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
