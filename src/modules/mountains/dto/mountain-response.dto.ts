import { ApiProperty } from '@nestjs/swagger';
import { HikingStatus, MountainStatus, MountainType } from '../schemas/mountain.schema';

export class RegionSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class MountainResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  elevation: number;

  @ApiProperty({ type: RegionSummaryDto })
  province: RegionSummaryDto;

  @ApiProperty({ type: RegionSummaryDto })
  city: RegionSummaryDto;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty({
    example: 'https://www.google.com/maps?q=-8.1077,112.92',
  })
  mapsUrl: string;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty({ enum: MountainType })
  type: MountainType;

  @ApiProperty({ enum: MountainStatus })
  status: MountainStatus;

  @ApiProperty({ enum: HikingStatus })
  hikingStatus: HikingStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class MountainListResponseDto {
  @ApiProperty({ type: [MountainResponseDto] })
  data: MountainResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}
