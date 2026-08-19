import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HikingStatus, MountainStatus, MountainType } from '../schemas/mountain.schema';

export class CreateMountainDto {
  @ApiProperty({ example: 'Gunung Semeru' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'Puncak tertinggi di Pulau Jawa.' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @ApiProperty({ example: 3676 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  elevation: number;

  @ApiProperty()
  @IsMongoId()
  provinceId: string;

  @ApiProperty()
  @IsMongoId()
  cityId: string;

  @ApiProperty({ example: -8.1077 })
  @Type(() => Number)
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 112.92 })
  @Type(() => Number)
  @IsLongitude()
  longitude: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['/uploads/mountains/2026/08/semeru.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    enum: MountainType,
    default: MountainType.NON_VOLCANO,
  })
  @IsOptional()
  @IsEnum(MountainType)
  type?: MountainType;

  @ApiPropertyOptional({ enum: MountainStatus, default: MountainStatus.ACTIVE })
  @IsOptional()
  @IsEnum(MountainStatus)
  status?: MountainStatus;

  @ApiPropertyOptional({ enum: HikingStatus, default: HikingStatus.OPEN })
  @IsOptional()
  @IsEnum(HikingStatus)
  hikingStatus?: HikingStatus;
}
