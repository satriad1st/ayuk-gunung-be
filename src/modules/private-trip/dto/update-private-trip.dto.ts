import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { TRIP_PACKAGE_KEYS } from '../schemas/private-trip.schema';

function emptyToUndefined({ value }: { value: unknown }) {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }
  return value;
}

export class TripPackageDto {
  @ApiProperty({ enum: TRIP_PACKAGE_KEYS, example: 'tektok' })
  @IsIn([...TRIP_PACKAGE_KEYS])
  key: (typeof TRIP_PACKAGE_KEYS)[number];

  @ApiProperty({ example: 'Paket TEKTOK (One Day Challenge)' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(400)
  tagline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  philosophy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  extrasIntro?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(250, { each: true })
  facilities: string[];

  @ApiPropertyOptional({ example: 'Rp 1.xxx.xxx / pax' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  startingPrice?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minPax?: number;
}

export class ComparisonRowDto {
  @ApiProperty({ example: 'Beban Bawaan' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  feature: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  tektok: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  camp: string;
}

export class WhyItemDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;
}

export class UpdatePrivateTripDto {
  @ApiPropertyOptional({ example: 'Private Trip' })
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(60)
  eyebrow?: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(160)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(800)
  intro: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(80)
  contactName?: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  whatsappPhone?: string;

  @ApiPropertyOptional({ example: 'Tanya Jadwal & Harga' })
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(60)
  whatsappCtaLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(300)
  whatsappMessage?: string;

  @ApiProperty({ type: [TripPackageDto] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => TripPackageDto)
  packages: TripPackageDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(120)
  comparisonTitle?: string;

  @ApiProperty({ type: [ComparisonRowDto] })
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => ComparisonRowDto)
  comparisonRows: ComparisonRowDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(120)
  whyTitle?: string;

  @ApiProperty({ type: [WhyItemDto] })
  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => WhyItemDto)
  whyItems: WhyItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(160)
  ctaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(400)
  ctaDescription?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(400, { each: true })
  notes: string[];
}
