import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { HomestayStatus, RentalType } from '../schemas/homestay.schema';

export class QueryHomestayDto {
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
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  provinceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  cityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  mountainId?: string;

  @ApiPropertyOptional({ enum: HomestayStatus })
  @IsOptional()
  @IsEnum(HomestayStatus)
  status?: HomestayStatus;

  @ApiPropertyOptional({ enum: RentalType })
  @IsOptional()
  @IsEnum(RentalType)
  rentalType?: RentalType;
}
