import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TripPackageResponseDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  tagline?: string;

  @ApiPropertyOptional()
  philosophy?: string;

  @ApiPropertyOptional()
  duration?: string;

  @ApiPropertyOptional()
  extrasIntro?: string;

  @ApiProperty({ type: [String] })
  facilities: string[];

  @ApiPropertyOptional()
  startingPrice?: string;

  @ApiPropertyOptional()
  minPax?: number;
}

export class ComparisonRowResponseDto {
  @ApiProperty()
  feature: string;

  @ApiProperty()
  tektok: string;

  @ApiProperty()
  camp: string;
}

export class WhyItemResponseDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;
}

export class PrivateTripResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  eyebrow?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  intro: string;

  @ApiPropertyOptional()
  contactName?: string;

  @ApiPropertyOptional()
  whatsappPhone?: string;

  @ApiPropertyOptional()
  whatsappCtaLabel?: string;

  @ApiPropertyOptional()
  whatsappMessage?: string;

  @ApiProperty({ type: [TripPackageResponseDto] })
  packages: TripPackageResponseDto[];

  @ApiPropertyOptional()
  comparisonTitle?: string;

  @ApiProperty({ type: [ComparisonRowResponseDto] })
  comparisonRows: ComparisonRowResponseDto[];

  @ApiPropertyOptional()
  whyTitle?: string;

  @ApiProperty({ type: [WhyItemResponseDto] })
  whyItems: WhyItemResponseDto[];

  @ApiPropertyOptional()
  ctaTitle?: string;

  @ApiPropertyOptional()
  ctaDescription?: string;

  @ApiProperty({ type: [String] })
  notes: string[];

  @ApiProperty()
  updatedAt: Date;
}
