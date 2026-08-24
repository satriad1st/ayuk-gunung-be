import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FavoriteItemType } from '../favorite-item-type';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({ timestamps: true, collection: 'favorites' })
export class Favorite {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: String, enum: FavoriteItemType, required: true })
  itemType: FavoriteItemType;

  @Prop({ type: Types.ObjectId, required: true })
  itemId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

FavoriteSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });
FavoriteSchema.index({ user: 1, createdAt: -1 });
