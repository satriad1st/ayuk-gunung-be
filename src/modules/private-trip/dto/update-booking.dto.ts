import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePrivateTripBookingDto } from './create-booking.dto';

export class UpdatePrivateTripBookingDto extends PartialType(
  OmitType(CreatePrivateTripBookingDto, ['firstPayment'] as const),
) {}
