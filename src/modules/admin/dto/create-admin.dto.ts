import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AdminRole } from '../../../common/constants/admin-roles';

export class CreateAdminDto {
  @ApiProperty({ example: 'Siti Homestay' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'siti@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ApiProperty({ enum: AdminRole, example: AdminRole.ADMIN_HOMESTAY })
  @IsEnum(AdminRole)
  role: AdminRole;
}
