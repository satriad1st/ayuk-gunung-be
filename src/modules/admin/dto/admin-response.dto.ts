import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole, AdminStatus } from '../../../common/constants/admin-roles';
import { Permission } from '../../../common/constants/permissions';
import { AdminMenu } from '../permissions/menus';

export class AdminResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: AdminRole })
  role: AdminRole;

  @ApiProperty({ enum: AdminStatus })
  status: AdminStatus;

  @ApiProperty({ enum: Permission, isArray: true })
  permissions: Permission[];

  @ApiPropertyOptional()
  bannedReason?: string;

  @ApiPropertyOptional()
  bannedAt?: Date;

  @ApiPropertyOptional()
  lastLoginAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AdminAuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: '7d' })
  expiresIn: string;

  @ApiProperty({ type: AdminResponseDto })
  admin: AdminResponseDto;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  menus: AdminMenu[];
}

export class AdminProfileResponseDto {
  @ApiProperty({ type: AdminResponseDto })
  admin: AdminResponseDto;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  menus: AdminMenu[];
}

export class AdminListResponseDto {
  @ApiProperty({ type: [AdminResponseDto] })
  data: AdminResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  total: number;
}
