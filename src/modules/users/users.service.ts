import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { UserRole } from '../../common/constants/roles';
import { escapeRegex } from '../../common/utils/escape-regex';
import type { UserResponseDto } from '../auth/dto/auth-response.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { User, UserDocument } from './schemas/user.schema';

type NamedRef = { _id: Types.ObjectId; name: string };

export type UserCreateInput = Partial<User> &
  Pick<User, 'email' | 'name'> & {
    password?: string;
  };

const PROFILE_POPULATE = [
  { path: 'province', select: 'name' },
  { path: 'city', select: 'name' },
];

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(data: UserCreateInput) {
    return this.userModel.create(data);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  findByEmailWithSecrets(email: string) {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password +emailVerificationCodeHash')
      .exec();
  }

  findByEmailWithPassword(email: string) {
    return this.findByEmailWithSecrets(email);
  }

  findByGoogleId(googleId: string) {
    return this.userModel.findOne({ googleId }).exec();
  }

  findById(id: string) {
    return this.userModel
      .findById(id)
      .select('+password')
      .populate(PROFILE_POPULATE)
      .exec();
  }

  findByIdWithSecrets(id: string) {
    return this.userModel.findById(id).select('+password').exec();
  }

  async findDocument(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }
    return user;
  }

  async findAll(query: QueryUserDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filter: Record<string, unknown> = {};

    if (query.banned === true) {
      filter.isActive = false;
    } else if (query.banned === false) {
      filter.isActive = true;
    }

    if (query.search) {
      const keyword = escapeRegex(query.search);
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ];
    }

    const [rows, total] = await Promise.all([
      this.userModel
        .find(filter)
        .populate(PROFILE_POPULATE)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return {
      data: rows.map((row) => this.toProfile(row)),
      page,
      limit,
      total,
    };
  }

  toAuthUser(user: UserDocument): AuthUser {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role ?? UserRole.USER,
    };
  }

  toProfile(user: UserDocument): UserResponseDto {
    const province = user.province as unknown as NamedRef | undefined;
    const city = user.city as unknown as NamedRef | undefined;

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role ?? UserRole.USER,
      phone: user.phone,
      birthDate: user.birthDate
        ? user.birthDate.toISOString().slice(0, 10)
        : undefined,
      bloodType: user.bloodType,
      province:
        province?._id && province.name
          ? { id: province._id.toString(), name: province.name }
          : undefined,
      city:
        city?._id && city.name
          ? { id: city._id.toString(), name: city.name }
          : undefined,
      address: user.address,
      latitude: user.latitude,
      longitude: user.longitude,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified ?? false,
      googleLinked: Boolean(user.googleId),
      hasPassword: Boolean(user.password),
      isActive: user.isActive !== false,
      bannedReason: user.bannedReason,
      bannedAt: user.bannedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
