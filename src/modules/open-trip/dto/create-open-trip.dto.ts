import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { OpenTripStatus } from '../schemas/open-trip.schema';

const DATE_YMD = /^\d{4}-\d{2}-\d{2}$/;

export class OpenTripMeetingPointDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Stasiun Bogor, pukul 20.00' })
  @IsString()
  @MinLength(3)
  @MaxLength(240)
  name: string;

  @ApiProperty({ example: 1750000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  pricePerPerson: number;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  suggestedDp?: number;

  @ApiPropertyOptional({ example: '2026-10-09' })
  @IsOptional()
  @Matches(DATE_YMD)
  gatherDate?: string;

  @ApiPropertyOptional({ example: '20:00' })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  gatherTime?: string;
}

export class CreateOpenTripDto {
  @ApiProperty({ example: 'Open Trip Semeru 17 Agustus' })
  @IsString()
  @MinLength(3)
  @MaxLength(140)
  name: string;

  @ApiProperty()
  @IsMongoId()
  mountainId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  itinerary?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includes?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: '2026-10-10' })
  @Matches(DATE_YMD)
  startDate: string;

  @ApiProperty({ example: '2026-10-12' })
  @Matches(DATE_YMD)
  endDate: string;

  @ApiProperty({ type: [OpenTripMeetingPointDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpenTripMeetingPointDto)
  @ArrayMinSize(1)
  meetingPoints: OpenTripMeetingPointDto[];

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quota: number;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  whatsappPhone: string;

  @ApiPropertyOptional({ example: 'CS Ayuk Gunung' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  whatsappName?: string;

  @ApiPropertyOptional({ enum: OpenTripStatus })
  @IsOptional()
  @IsEnum(OpenTripStatus)
  status?: OpenTripStatus;
}
