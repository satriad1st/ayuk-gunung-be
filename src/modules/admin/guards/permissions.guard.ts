import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../../../common/constants/permissions';
import { AdminAuthUser } from '../../../common/interfaces/auth-admin.interface';
import { hasPermission } from '../permissions/role-permissions';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required?.length) {
      return true;
    }

    const admin = context
      .switchToHttp()
      .getRequest<{ user: AdminAuthUser }>().user;

    if (!admin) {
      throw new ForbiddenException('Missing admin context');
    }

    const allowed = required.every((permission) =>
      hasPermission(admin.role, permission),
    );

    if (!allowed) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
