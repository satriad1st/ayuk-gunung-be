import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { HomestayStatus, RentalType } from '../schemas/homestay.schema';

export class CreateHomestayDto {
  @ApiProperty({ example: 'Homestay Ranu Pani' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'Dusun Ranu Pani, Senduro, Lumajang' })
  @IsString()
  @MinLength(5)
  @MaxLength(250)
  address: string;

  @ApiProperty({ example: 'Bu Siti' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  contactName: string;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  contactPhone: string;

  @ApiProperty({
    enum: RentalType,
    example: RentalType.ROOM,
    description: 'Harga dihitung per kamar, per orang, atau per rumah',
  })
  @IsEnum(RentalType)
  rentalType: RentalType;

  @ApiProperty()
  @IsMongoId()
  provinceId: string;

  @ApiProperty()
  @IsMongoId()
  cityId: string;

  @ApiProperty({ example: -8.0148 })
  @Type(() => Number)
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 112.918 })
  @Type(() => Number)
  @IsLongitude()
  longitude: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  mountainIds: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  facilityIds?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ enum: HomestayStatus })
  @IsOptional()
  @IsEnum(HomestayStatus)
  status?: HomestayStatus;
}
