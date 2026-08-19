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
import {
  BasecampStatus,
  OvernightStay,
  TrashCheck,
} from '../schemas/basecamp.schema';

export class QueryBasecampDto {
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

  @ApiPropertyOptional({ example: 'ranu' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  mountainId?: string;

  @ApiPropertyOptional({ enum: OvernightStay })
  @IsOptional()
  @IsEnum(OvernightStay)
  overnightStay?: OvernightStay;

  @ApiPropertyOptional({ enum: TrashCheck })
  @IsOptional()
  @IsEnum(TrashCheck)
  trashCheck?: TrashCheck;

  @ApiPropertyOptional({ enum: BasecampStatus })
  @IsOptional()
  @IsEnum(BasecampStatus)
  status?: BasecampStatus;
}
