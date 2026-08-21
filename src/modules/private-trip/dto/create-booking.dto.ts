import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsIn,
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
import {
  PaymentMethod,
  TRIP_TYPES,
} from '../schemas/private-trip-booking.schema';

const DATE_YMD = /^\d{4}-\d{2}-\d{2}$/;

export class FirstPaymentDto {
  @ApiProperty({ example: 500000 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ enum: PaymentMethod, default: PaymentMethod.TRANSFER })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  note?: string;

  @ApiPropertyOptional({ example: '2026-08-21' })
  @IsOptional()
  @Matches(DATE_YMD)
  paidAt?: string;
}

export class CreatePrivateTripBookingDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  customerName: string;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  customerPhone: string;

  @ApiPropertyOptional({ example: 'budi@email.com' })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsEmail()
  @MaxLength(120)
  customerEmail?: string;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pax: number;

  @ApiProperty()
  @IsMongoId()
  mountainId: string;

  @ApiProperty({ enum: TRIP_TYPES, example: 'tektok' })
  @IsIn([...TRIP_TYPES])
  tripType: (typeof TRIP_TYPES)[number];

  @ApiProperty({ example: 1, description: 'Jumlah hari' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  days: number;

  @ApiProperty({ example: 0, description: 'Jumlah malam' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nights: number;

  @ApiProperty({ example: '2026-08-29' })
  @Matches(DATE_YMD)
  startDate: string;

  @ApiProperty({ example: 1500000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  pricePerPerson: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  discount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ type: FirstPaymentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FirstPaymentDto)
  firstPayment?: FirstPaymentDto;
}
