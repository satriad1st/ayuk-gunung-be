import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaymentMethod,
  PaymentStatus,
} from '../schemas/private-trip-booking.schema';

export class BookingMountainDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class TripPaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paidAt: Date;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  createdAt: Date;
}

export class PrivateTripBookingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerPhone: string;

  @ApiPropertyOptional()
  customerEmail?: string;

  @ApiProperty()
  pax: number;

  @ApiProperty({ type: BookingMountainDto })
  mountain: BookingMountainDto;

  @ApiProperty()
  tripType: string;

  @ApiProperty()
  days: number;

  @ApiProperty()
  nights: number;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  pricePerPerson: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  finalPrice: number;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty({ type: [TripPaymentResponseDto] })
  payments: TripPaymentResponseDto[];

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  remainingAmount: number;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PrivateTripBookingListResponseDto {
  @ApiProperty({ type: [PrivateTripBookingResponseDto] })
  data: PrivateTripBookingResponseDto[];

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  total: number;
}
