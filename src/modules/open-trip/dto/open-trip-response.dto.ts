import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OpenTripStatus, OpenTripType } from '../schemas/open-trip.schema';

export class OpenTripMountainDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  slug?: string;
}

export class OpenTripMeetingPointResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  pricePerPerson: number;

  @ApiProperty()
  suggestedDp: number;

  @ApiPropertyOptional()
  gatherDate?: string;

  @ApiPropertyOptional()
  gatherTime?: string;
}

export class OpenTripResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ type: OpenTripMountainDto })
  mountain: OpenTripMountainDto;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  itinerary?: string;

  @ApiProperty({ type: [String] })
  includes: string[];

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty({ enum: OpenTripType })
  tripType: OpenTripType;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty({ type: [OpenTripMeetingPointResponseDto] })
  meetingPoints: OpenTripMeetingPointResponseDto[];

  @ApiProperty()
  meetingPoint: string;

  @ApiProperty()
  quota: number;

  @ApiProperty()
  bookedPax: number;

  @ApiProperty()
  remainingQuota: number;

  @ApiProperty()
  pricePerPerson: number;

  @ApiProperty()
  suggestedDp: number;

  @ApiProperty()
  whatsappPhone: string;

  @ApiPropertyOptional()
  whatsappName?: string;

  @ApiProperty({ enum: OpenTripStatus })
  status: OpenTripStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class OpenTripListResponseDto {
  @ApiProperty({ type: [OpenTripResponseDto] })
  data: OpenTripResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}
