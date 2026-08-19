import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HomestayStatus, RentalType } from '../schemas/homestay.schema';
import { PriceType, RoomType } from '../schemas/room.schema';

export class NamedSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class HomestayResponseDto {
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

  @ApiProperty({ enum: RentalType })
  rentalType: RentalType;

  @ApiProperty({ type: NamedSummaryDto })
  province: NamedSummaryDto;

  @ApiProperty({ type: NamedSummaryDto })
  city: NamedSummaryDto;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  mapsUrl: string;

  @ApiProperty({ type: [NamedSummaryDto] })
  mountains: NamedSummaryDto[];

  @ApiProperty({ type: [NamedSummaryDto] })
  facilities: NamedSummaryDto[];

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  roomCount: number;

  @ApiProperty()
  ownerId: string;

  @ApiProperty({ enum: HomestayStatus })
  status: HomestayStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class HomestayListResponseDto {
  @ApiProperty({ type: [HomestayResponseDto] })
  data: HomestayResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

export class RoomResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  homestayId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: RoomType })
  type: RoomType;

  @ApiProperty({ enum: PriceType })
  priceType: PriceType;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  priceMax?: number;

  @ApiProperty({ example: 'Rp 150.000 - 200.000' })
  priceLabel: string;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
