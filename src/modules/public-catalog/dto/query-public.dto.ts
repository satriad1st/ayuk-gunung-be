import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MountainType } from '../../mountains/schemas/mountain.schema';

function emptyToUndefined(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export class QueryPublicMountainDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 12, default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  limit?: number = 12;

  @ApiPropertyOptional({ example: 'semeru' })
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @MaxLength(80)
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsMongoId()
  provinceId?: string;

  @ApiPropertyOptional({ enum: MountainType })
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsEnum(MountainType)
  type?: MountainType;
}

export class QueryPublicSearchDto {
  @ApiPropertyOptional({ example: 'semeru' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  q: string;
}
