import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BLOOD_TYPES } from '../../../common/constants/blood-types';

export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'budi@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  @Matches(/^[0-9+\-\s]{8,20}$/, {
    message: 'Nomor telepon tidak valid',
  })
  phone: string;

  @ApiProperty({ example: 'rahasia123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ApiPropertyOptional({ example: '1998-04-21' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'O+' })
  @IsOptional()
  @IsIn([...BLOOD_TYPES])
  bloodType?: (typeof BLOOD_TYPES)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  provinceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  cityId?: string;

  @ApiPropertyOptional({ example: 'Jl. Raya Pendaki No. 12' })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsString()
  @MaxLength(250)
  address?: string;

  @ApiPropertyOptional({ example: -6.2 })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ example: 106.8 })
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;
}
