import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BasecampOpenStatus,
  BasecampStatus,
  OpenDaysType,
  OvernightStay,
  SimaksiType,
  TrashCheck,
} from '../schemas/basecamp.schema';

export class MountainSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class RouteSegmentResponseDto {
  @ApiProperty()
  fromName: string;

  @ApiProperty()
  toName: string;

  @ApiPropertyOptional()
  elevationGain?: number;

  @ApiPropertyOptional()
  distanceKm?: number;

  @ApiPropertyOptional()
  durationMinutesMin?: number;

  @ApiPropertyOptional()
  durationMinutesMax?: number;
}

export class BasecampResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  contactName: string;

  @ApiProperty()
  contactPhone: string;

  @ApiProperty({ type: MountainSummaryDto })
  mountain: MountainSummaryDto;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  mapsUrl: string;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiPropertyOptional()
  gpxFile?: string;

  @ApiPropertyOptional()
  gpxFileName?: string;

  @ApiProperty({ enum: OvernightStay })
  overnightStay: OvernightStay;

  @ApiPropertyOptional()
  simaksiPrice?: number;

  @ApiProperty({ enum: SimaksiType })
  simaksiType: SimaksiType;

  @ApiPropertyOptional()
  simaksiRegistrationUrl?: string;

  @ApiProperty({ enum: TrashCheck })
  trashCheck: TrashCheck;

  @ApiProperty({ enum: BasecampStatus })
  status: BasecampStatus;

  @ApiProperty({ enum: BasecampOpenStatus })
  openStatus: BasecampOpenStatus;

  @ApiProperty({ enum: OpenDaysType })
  openDaysType: OpenDaysType;

  @ApiProperty({ type: [String] })
  openDays: string[];

  @ApiPropertyOptional()
  openTimeFrom?: string;

  @ApiPropertyOptional()
  openTimeTo?: string;

  @ApiProperty()
  tektokAllowed: boolean;

  @ApiPropertyOptional()
  tektokDeadline?: string;

  @ApiPropertyOptional()
  elevationGain?: number;

  @ApiPropertyOptional()
  distanceKm?: number;

  @ApiPropertyOptional()
  durationHoursMin?: number;

  @ApiPropertyOptional()
  durationHoursMax?: number;

  @ApiProperty({ type: [RouteSegmentResponseDto] })
  routeSegments: RouteSegmentResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class BasecampListResponseDto {
  @ApiProperty({ type: [BasecampResponseDto] })
  data: BasecampResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}
