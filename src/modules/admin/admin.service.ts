import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { AdminRole, AdminStatus } from '../../common/constants/admin-roles';
import { AdminAuthUser } from '../../common/interfaces/auth-admin.interface';
import { BanAdminDto } from './dto/ban-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { QueryAdminDto } from './dto/query-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { getMenusForRole } from './permissions/menus';
import { getPermissionsForRole } from './permissions/role-permissions';
import { Admin, AdminDocument } from './schemas/admin.schema';

const SALT_ROUNDS = 12;

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  async create(dto: CreateAdminDto): Promise<AdminResponseDto> {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    try {
      const admin = await this.adminModel.create({
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        role: dto.role,
        status: AdminStatus.ACTIVE,
      });

      return this.toResponse(admin);
    } catch (error) {
      this.rethrowDuplicateEmail(error);
      throw error;
    }
  }

  async findAll(query: QueryAdminDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filter: {
      role?: AdminRole;
      status?: AdminStatus;
      $or?: Array<Record<string, unknown>>;
    } = {};

    if (query.role) {
      filter.role = query.role;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      const keyword = query.search.trim();
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.adminModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.adminModel.countDocuments(filter).exec(),
    ]);

    return {
      data: data.map((admin) => this.toResponse(admin)),
      page,
      limit,
      total,
    };
  }

  async findById(id: string): Promise<AdminResponseDto> {
    const admin = await this.findDocumentById(id);
    return this.toResponse(admin);
  }

  async update(id: string, dto: UpdateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.findDocumentById(id);

    if (dto.role && dto.role !== admin.role) {
      await this.ensureNotLastSuperadmin(admin, 'change the role of');
    }

    if (dto.email) {
      admin.email = dto.email.toLowerCase();
    }

    if (dto.name) {
      admin.name = dto.name;
    }

    if (dto.role) {
      admin.role = dto.role;
    }

    if (dto.status) {
      admin.status = dto.status;
      if (dto.status === AdminStatus.ACTIVE) {
        admin.bannedReason = undefined;
        admin.bannedAt = undefined;
        admin.bannedBy = undefined;
      }
    }

    if (dto.password) {
      admin.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    try {
      await admin.save();
      return this.toResponse(admin);
    } catch (error) {
      this.rethrowDuplicateEmail(error);
      throw error;
    }
  }

  async remove(id: string, actor: AdminAuthUser): Promise<void> {
    const admin = await this.findDocumentById(id);
    this.ensureNotSelf(id, actor.id, 'delete');
    await this.ensureNotLastSuperadmin(admin, 'delete');
    await admin.deleteOne();
  }

  async ban(
    id: string,
    dto: BanAdminDto,
    actor: AdminAuthUser,
  ): Promise<AdminResponseDto> {
    const admin = await this.findDocumentById(id);
    this.ensureNotSelf(id, actor.id, 'ban');
    await this.ensureNotLastSuperadmin(admin, 'ban');

    if (admin.status === AdminStatus.BANNED) {
      throw new BadRequestException('This account is already banned');
    }

    admin.status = AdminStatus.BANNED;
    admin.bannedReason = dto.reason;
    admin.bannedAt = new Date();
    admin.bannedBy = new Types.ObjectId(actor.id);
    await admin.save();

    return this.toResponse(admin);
  }

  async unban(id: string): Promise<AdminResponseDto> {
    const admin = await this.findDocumentById(id);

    if (admin.status !== AdminStatus.BANNED) {
      throw new BadRequestException('This account is not banned');
    }

    admin.status = AdminStatus.ACTIVE;
    admin.bannedReason = undefined;
    admin.bannedAt = undefined;
    admin.bannedBy = undefined;
    await admin.save();

    return this.toResponse(admin);
  }

  findByEmailWithPassword(email: string) {
    return this.adminModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Password confirmation does not match');
    }

    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const admin = await this.findByIdWithPassword(id);
    const matches = await bcrypt.compare(dto.currentPassword, admin.password);

    if (!matches) {
      throw new BadRequestException('Current password is incorrect');
    }

    admin.password = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await admin.save();
  }

  findDocumentByIdOrNull(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.resolve(null);
    }

    return this.adminModel.findById(id).exec();
  }

  async markLogin(id: string) {
    await this.adminModel
      .updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } })
      .exec();
  }

  async countByRole(role: AdminRole) {
    return this.adminModel.countDocuments({ role }).exec();
  }

  toResponse(admin: AdminDocument): AdminResponseDto {
    return {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      status: admin.status,
      permissions: getPermissionsForRole(admin.role),
      bannedReason: admin.bannedReason,
      bannedAt: admin.bannedAt,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  toAuthUser(admin: AdminDocument): AdminAuthUser {
    return {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      status: admin.status,
      permissions: getPermissionsForRole(admin.role),
    };
  }

  toProfile(admin: AdminResponseDto) {
    return {
      admin,
      menus: getMenusForRole(admin.role),
    };
  }

  private async findByIdWithPassword(id: string): Promise<AdminDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Admin not found');
    }

    const admin = await this.adminModel.findById(id).select('+password').exec();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  private async findDocumentById(id: string): Promise<AdminDocument> {
    const admin = await this.findDocumentByIdOrNull(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  private ensureNotSelf(targetId: string, actorId: string, action: string) {
    if (targetId === actorId) {
      throw new ForbiddenException(`You cannot ${action} your own account`);
    }
  }

  private async ensureNotLastSuperadmin(admin: AdminDocument, action: string) {
    if (admin.role !== AdminRole.SUPERADMIN) {
      return;
    }

    const superadminCount = await this.countByRole(AdminRole.SUPERADMIN);
    if (superadminCount <= 1) {
      throw new ForbiddenException(
        `Cannot ${action} the last superadmin account`,
      );
    }
  }

  private rethrowDuplicateEmail(error: unknown): void {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ConflictException('Email is already registered');
    }
  }
}
