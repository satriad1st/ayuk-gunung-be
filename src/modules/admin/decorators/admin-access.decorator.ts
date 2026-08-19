import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Permission } from '../../../common/constants/permissions';
import { AdminJwtAuthGuard } from '../guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from './permissions.decorator';

export function AdminAccess(...permissions: Permission[]) {
  return applyDecorators(
    UseGuards(AdminJwtAuthGuard, PermissionsGuard),
    RequirePermissions(...permissions),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Missing or invalid admin token' }),
    ApiForbiddenResponse({ description: 'Insufficient permission' }),
  );
}
