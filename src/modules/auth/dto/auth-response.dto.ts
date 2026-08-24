import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/constants/roles';

export class NamedRefDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'budi@example.com' })
  email: string;

  @ApiProperty({ example: 'Budi Santoso' })
  name: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  birthDate?: string;

  @ApiPropertyOptional()
  bloodType?: string;

  @ApiPropertyOptional({ type: NamedRefDto })
  province?: NamedRefDto;

  @ApiPropertyOptional({ type: NamedRefDto })
  city?: NamedRefDto;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  latitude?: number;

  @ApiPropertyOptional()
  longitude?: number;

  @ApiPropertyOptional()
  avatarUrl?: string;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  googleLinked: boolean;

  @ApiProperty()
  hasPassword: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  bannedReason?: string;

  @ApiPropertyOptional()
  bannedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: '7d' })
  expiresIn: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

export class RegisterPendingDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  debugCode?: string;
}

export class UserListResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;
}
