import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  OpenTripBookingStatus,
  OpenTripPaymentChannel,
  OpenTripPaymentMethod,
  ParticipantGender,
} from '../schemas/open-trip-booking.schema';

export class OpenTripAddonResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;
}

export class OpenTripParticipantResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: ParticipantGender })
  gender: ParticipantGender;

  @ApiProperty()
  birthDate: string;
}

export class OpenTripPaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paidAt: Date;

  @ApiProperty({ enum: OpenTripPaymentMethod })
  method: OpenTripPaymentMethod;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  createdAt: Date;
}

export class OpenTripBookingTripDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  mountainName: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;
}

export class OpenTripBookingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: OpenTripBookingTripDto })
  openTrip: OpenTripBookingTripDto;

  @ApiPropertyOptional()
  userId?: string;

  @ApiProperty()
  bookerName: string;

  @ApiProperty()
  bookerPhone: string;

  @ApiPropertyOptional()
  bookerEmail?: string;

  @ApiPropertyOptional()
  meetingPointId?: string;

  @ApiProperty()
  meetingPoint: string;

  @ApiPropertyOptional()
  meetingGatherDate?: string;

  @ApiPropertyOptional()
  meetingGatherTime?: string;

  @ApiProperty()
  pax: number;

  @ApiProperty({ type: [OpenTripParticipantResponseDto] })
  participants: OpenTripParticipantResponseDto[];

  @ApiProperty({ type: [OpenTripAddonResponseDto] })
  addons: OpenTripAddonResponseDto[];

  @ApiProperty()
  addonTotal: number;

  @ApiProperty({ enum: OpenTripPaymentChannel })
  paymentChannel: OpenTripPaymentChannel;

  @ApiProperty({ enum: OpenTripBookingStatus })
  bookingStatus: OpenTripBookingStatus;

  @ApiProperty()
  pricePerPerson: number;

  @ApiProperty()
  finalPrice: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  remainingAmount: number;

  @ApiProperty({ type: [OpenTripPaymentResponseDto] })
  payments: OpenTripPaymentResponseDto[];

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  source: string;

  @ApiPropertyOptional()
  whatsappUrl?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class OpenTripBookingListResponseDto {
  @ApiProperty({ type: [OpenTripBookingResponseDto] })
  data: OpenTripBookingResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

export class UserOpenTripBookingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  openTripName: string;

  @ApiProperty()
  mountainName: string;

  @ApiProperty()
  tripStartDate: string;

  @ApiProperty()
  tripEndDate: string;

  @ApiProperty()
  bookerName: string;

  @ApiProperty()
  meetingPoint: string;

  @ApiPropertyOptional()
  meetingGatherDate?: string;

  @ApiPropertyOptional()
  meetingGatherTime?: string;

  @ApiProperty()
  pricePerPerson: number;

  @ApiProperty()
  pax: number;

  @ApiProperty({ type: [OpenTripParticipantResponseDto] })
  participants: OpenTripParticipantResponseDto[];

  @ApiProperty({ type: [OpenTripAddonResponseDto] })
  addons: OpenTripAddonResponseDto[];

  @ApiProperty()
  addonTotal: number;

  @ApiProperty({ enum: OpenTripBookingStatus })
  bookingStatus: OpenTripBookingStatus;

  @ApiProperty()
  finalPrice: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  remainingAmount: number;

  @ApiProperty({ type: [OpenTripPaymentResponseDto] })
  payments: OpenTripPaymentResponseDto[];

  @ApiProperty()
  createdAt: Date;
}

export class UserOpenTripBookingListDto {
  @ApiProperty({ type: [UserOpenTripBookingDto] })
  data: UserOpenTripBookingDto[];

  @ApiProperty()
  total: number;
}
