import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { PriceType, RoomType } from '../schemas/room.schema';

export class CreateRoomDto {
  @ApiProperty({ example: 'Kamar Bromo View' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({ enum: RoomType, example: RoomType.DELUXE })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({ enum: PriceType, example: PriceType.RANGE })
  @IsEnum(PriceType)
  priceType: PriceType;

  @ApiProperty({
    example: 150000,
    description: 'Harga tetap atau harga minimum',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 200000,
    description: 'Harga maksimum, wajib jika priceType = range',
  })
  @ValidateIf((dto: CreateRoomDto) => dto.priceType === PriceType.RANGE)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
