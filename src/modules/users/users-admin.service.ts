import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import type { AdminAuthUser } from '../../common/interfaces/auth-admin.interface';
import type { BanAdminDto } from '../admin/dto/ban-admin.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UsersService } from './users.service';

@Injectable()
export class UsersAdminService {
  constructor(private readonly usersService: UsersService) {}

  findAll(query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  async findById(id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }
    return this.usersService.toProfile(user);
  }

  async ban(id: string, dto: BanAdminDto, actor: AdminAuthUser) {
    const user = await this.usersService.findDocument(id);

    if (user.isActive === false) {
      throw new BadRequestException('Pengguna ini sudah diblokir');
    }

    user.isActive = false;
    user.bannedReason = dto.reason;
    user.bannedAt = new Date();
    user.bannedBy = new Types.ObjectId(actor.id);
    await user.save();

    const populated = await this.usersService.findById(id);
    return this.usersService.toProfile(populated ?? user);
  }

  async unban(id: string) {
    const user = await this.usersService.findDocument(id);

    if (user.isActive !== false) {
      throw new BadRequestException('Pengguna ini tidak diblokir');
    }

    user.isActive = true;
    user.bannedReason = undefined;
    user.bannedAt = undefined;
    user.bannedBy = undefined;
    await user.save();

    const populated = await this.usersService.findById(id);
    return this.usersService.toProfile(populated ?? user);
  }
}
