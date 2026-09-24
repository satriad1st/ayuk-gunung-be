import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { OpenTripStatus, OpenTripType } from '../schemas/open-trip.schema';

const DATE_YMD = /^\d{4}-\d{2}-\d{2}$/;

export class QueryOpenTripDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  mountainId?: string;

  @ApiPropertyOptional({
    example: '2026-02-01',
    description: 'Trip start date from (YYYY-MM-DD)',
  })
  @IsOptional()
  @Matches(DATE_YMD)
  from?: string;

  @ApiPropertyOptional({
    example: '2026-02-28',
    description: 'Trip start date to (YYYY-MM-DD)',
  })
  @IsOptional()
  @Matches(DATE_YMD)
  to?: string;

  @ApiPropertyOptional({
    description:
      'If true, from/to match trips that overlap the range instead of startDate only',
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  overlap?: boolean;

  @ApiPropertyOptional({ enum: OpenTripStatus })
  @IsOptional()
  @IsEnum(OpenTripStatus)
  status?: OpenTripStatus;

  @ApiPropertyOptional({ enum: OpenTripType })
  @IsOptional()
  @IsEnum(OpenTripType)
  tripType?: OpenTripType;
}
