import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { BLOOD_TYPES } from '../../../common/constants/blood-types';

function emptyToNull({ value }: { value: unknown }) {
  if (value === '' || value === undefined) {
    return null;
  }
  return value;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value != null)
  @IsString()
  @Matches(/^[0-9+\-\s]{8,20}$/, {
    message: 'Nomor telepon tidak valid',
  })
  phone?: string | null;

  @ApiPropertyOptional({ example: '1998-04-21' })
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value != null)
  @IsDateString()
  birthDate?: string | null;

  @ApiPropertyOptional({ example: 'O+' })
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value != null)
  @IsIn([...BLOOD_TYPES])
  bloodType?: (typeof BLOOD_TYPES)[number] | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value != null)
  @IsMongoId()
  provinceId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value != null)
  @IsMongoId()
  cityId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value != null)
  @IsString()
  @MaxLength(250)
  address?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === undefined ? null : Number(value),
  )
  @ValidateIf((_, value) => value != null)
  @Type(() => Number)
  @IsLatitude()
  latitude?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === undefined ? null : Number(value),
  )
  @ValidateIf((_, value) => value != null)
  @Type(() => Number)
  @IsLongitude()
  longitude?: number | null;
}
