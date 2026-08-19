import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AdminRole, AdminStatus } from '../../../common/constants/admin-roles';

export class UpdateAdminDto {
  @ApiPropertyOptional({ example: 'Siti Homestay' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({ example: 'siti@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'PasswordBaru123!' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password?: string;

  @ApiPropertyOptional({ enum: AdminRole })
  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  @ApiPropertyOptional({
    enum: [AdminStatus.ACTIVE, AdminStatus.INACTIVE],
    description: 'Use ban/unban endpoints for banned status',
  })
  @IsOptional()
  @IsEnum([AdminStatus.ACTIVE, AdminStatus.INACTIVE])
  status?: AdminStatus.ACTIVE | AdminStatus.INACTIVE;
}
