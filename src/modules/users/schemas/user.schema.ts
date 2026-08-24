import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BLOOD_TYPES, type BloodType } from '../../../common/constants/blood-types';
import { UserRole } from '../../../common/constants/roles';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop()
  birthDate?: Date;

  @Prop({ type: String, enum: BLOOD_TYPES })
  bloodType?: BloodType;

  @Prop({ type: Types.ObjectId, ref: 'Province' })
  province?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'City' })
  city?: Types.ObjectId;

  @Prop({ trim: true })
  address?: string;

  @Prop({ min: -90, max: 90 })
  latitude?: number;

  @Prop({ min: -180, max: 180 })
  longitude?: number;

  @Prop({ trim: true })
  avatarUrl?: string;

  @Prop({ unique: true, sparse: true, trim: true })
  googleId?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ select: false })
  emailVerificationCodeHash?: string;

  @Prop()
  emailVerificationExpires?: Date;

  @Prop()
  emailVerificationSentAt?: Date;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ trim: true })
  bannedReason?: string;

  @Prop()
  bannedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  bannedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
