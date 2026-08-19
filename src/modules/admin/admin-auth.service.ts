import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AdminStatus } from '../../common/constants/admin-roles';
import { AdminJwtPayload } from '../../common/interfaces/auth-admin.interface';
import { AdminService } from './admin.service';
import { AdminAuthResponseDto } from './dto/admin-response.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: AdminLoginDto): Promise<AdminAuthResponseDto> {
    const admin = await this.adminService.findByEmailWithPassword(dto.email);

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (admin.status === AdminStatus.BANNED) {
      throw new ForbiddenException(
        admin.bannedReason
          ? `This account has been banned: ${admin.bannedReason}`
          : 'This account has been banned',
      );
    }

    if (admin.status !== AdminStatus.ACTIVE) {
      throw new ForbiddenException('This account is inactive');
    }

    await this.adminService.markLogin(admin._id.toString());

    const response = this.adminService.toResponse(admin);
    const payload: AdminJwtPayload = {
      sub: response.id,
      email: response.email,
      role: response.role,
      tokenType: 'admin',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>('jwt.expiresIn') ?? '7d',
      admin: response,
      menus: this.adminService.toProfile(response).menus,
    };
  }
}
