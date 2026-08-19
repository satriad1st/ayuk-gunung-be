import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminStatus } from '../../../common/constants/admin-roles';
import {
  AdminAuthUser,
  AdminJwtPayload,
} from '../../../common/interfaces/auth-admin.interface';
import { AdminService } from '../admin.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    configService: ConfigService,
    private readonly adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: AdminJwtPayload): Promise<AdminAuthUser> {
    if (payload.tokenType !== 'admin') {
      throw new UnauthorizedException('Invalid admin token');
    }

    const admin = await this.adminService.findDocumentByIdOrNull(payload.sub);

    if (!admin || admin.status !== AdminStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid or banned admin account');
    }

    return this.adminService.toAuthUser(admin);
  }
}
