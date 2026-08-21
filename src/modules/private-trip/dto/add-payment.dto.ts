import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { PaymentMethod } from '../schemas/private-trip-booking.schema';

export class AddBookingPaymentDto {
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
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  paidAt?: string;
}
