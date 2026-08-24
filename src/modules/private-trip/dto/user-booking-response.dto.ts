import { ApiProperty } from '@nestjs/swagger';
import {
  PaymentMethod,
  PaymentStatus,
} from '../schemas/private-trip-booking.schema';
import { BookingMountainDto } from './booking-response.dto';

export class UserTripPaymentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paidAt: Date;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;
}

export class UserPrivateTripBookingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerName: string;

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

  @ApiProperty({ type: [UserTripPaymentDto] })
  payments: UserTripPaymentDto[];

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  remainingAmount: number;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;
}

export class UserPrivateTripBookingListDto {
  @ApiProperty({ type: [UserPrivateTripBookingDto] })
  data: UserPrivateTripBookingDto[];

  @ApiProperty()
  total: number;
}
