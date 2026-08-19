import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminAuthUser } from '../../../common/interfaces/auth-admin.interface';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminAuthUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AdminAuthUser }>();
    return request.user;
  },
);
