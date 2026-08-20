import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PrivateTripDocument = HydratedDocument<PrivateTripContent>;

export const PRIVATE_TRIP_KEY = 'private_trip';

export const TRIP_PACKAGE_KEYS = ['tektok', 'camp'] as const;
export type TripPackageKey = (typeof TRIP_PACKAGE_KEYS)[number];

@Schema({ _id: false })
export class TripPackage {
  @Prop({ required: true, trim: true })
  key: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  tagline?: string;

  @Prop({ trim: true })
  philosophy?: string;

  @Prop({ trim: true })
  duration?: string;

  @Prop({ trim: true })
  extrasIntro?: string;

  @Prop({ type: [String], default: [] })
  facilities: string[];

  @Prop({ trim: true })
  startingPrice?: string;

  @Prop({ min: 1 })
  minPax?: number;
}

export const TripPackageSchema = SchemaFactory.createForClass(TripPackage);

@Schema({ _id: false })
export class ComparisonRow {
  @Prop({ required: true, trim: true })
  feature: string;

  @Prop({ required: true, trim: true })
  tektok: string;

  @Prop({ required: true, trim: true })
  camp: string;
}

export const ComparisonRowSchema = SchemaFactory.createForClass(ComparisonRow);

@Schema({ _id: false })
export class WhyItem {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;
}

export const WhyItemSchema = SchemaFactory.createForClass(WhyItem);

@Schema({ timestamps: true, collection: 'private_trip_contents' })
export class PrivateTripContent {
  @Prop({ required: true, unique: true, default: PRIVATE_TRIP_KEY })
  key: string;

  @Prop({ trim: true })
  eyebrow?: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  intro: string;

  @Prop({ trim: true })
  contactName?: string;

  @Prop({ trim: true })
  whatsappPhone?: string;

  @Prop({ trim: true })
  whatsappCtaLabel?: string;

  @Prop({ trim: true })
  whatsappMessage?: string;

  @Prop({ type: [TripPackageSchema], default: [] })
  packages: TripPackage[];

  @Prop({ trim: true })
  comparisonTitle?: string;

  @Prop({ type: [ComparisonRowSchema], default: [] })
  comparisonRows: ComparisonRow[];

  @Prop({ trim: true })
  whyTitle?: string;

  @Prop({ type: [WhyItemSchema], default: [] })
  whyItems: WhyItem[];

  @Prop({ trim: true })
  ctaTitle?: string;

  @Prop({ trim: true })
  ctaDescription?: string;

  @Prop({ type: [String], default: [] })
  notes: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const PrivateTripContentSchema =
  SchemaFactory.createForClass(PrivateTripContent);
