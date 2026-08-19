import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AdminRole, AdminStatus } from '../../../common/constants/admin-roles';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true, collection: 'admins' })
export class Admin {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: AdminRole, required: true })
  role: AdminRole;

  @Prop({ type: String, enum: AdminStatus, default: AdminStatus.ACTIVE })
  status: AdminStatus;

  @Prop({ trim: true })
  bannedReason?: string;

  @Prop()
  bannedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  bannedBy?: Types.ObjectId;

  @Prop()
  lastLoginAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.index({ role: 1, status: 1 });
