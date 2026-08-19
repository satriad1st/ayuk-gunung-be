import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  AuthUser,
  JwtPayload,
} from '../../../common/interfaces/auth-user.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    if (payload.tokenType === 'admin') {
      throw new UnauthorizedException('Invalid user token');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid or inactive account');
    }

    return this.usersService.toAuthUser(user);
  }
}
