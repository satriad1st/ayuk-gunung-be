import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  OpenTripBookingStatus,
  OpenTripPaymentChannel,
  OpenTripPaymentMethod,
  ParticipantGender,
} from '../schemas/open-trip-booking.schema';

const DATE_YMD = /^\d{4}-\d{2}-\d{2}$/;

export class OpenTripAddonDto {
  @ApiProperty({ example: 'Sewa sleeping bag' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 50000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(50_000_000)
  price: number;
}

export class OpenTripParticipantDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone: string;

  @ApiProperty({ enum: ParticipantGender })
  @IsEnum(ParticipantGender)
  gender: ParticipantGender;

  @ApiProperty({ example: '1998-04-12' })
  @Matches(DATE_YMD)
  birthDate: string;
}

export class CreateOpenTripBookingDto {
  @ApiProperty()
  @IsMongoId()
  openTripId: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  bookerName: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  bookerPhone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsEmail()
  @MaxLength(120)
  bookerEmail?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  meetingPointId: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pax: number;

  @ApiProperty({ type: [OpenTripParticipantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpenTripParticipantDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(40)
  participants: OpenTripParticipantDto[];

  @ApiPropertyOptional({ type: [OpenTripAddonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpenTripAddonDto)
  @ArrayMaxSize(20)
  addons?: OpenTripAddonDto[];

  @ApiPropertyOptional({ enum: OpenTripPaymentChannel })
  @IsOptional()
  @IsEnum(OpenTripPaymentChannel)
  paymentChannel?: OpenTripPaymentChannel;

  @ApiPropertyOptional({ enum: OpenTripBookingStatus })
  @IsOptional()
  @IsEnum(OpenTripBookingStatus)
  bookingStatus?: OpenTripBookingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  firstPaymentAmount?: number;

  @ApiPropertyOptional({ enum: OpenTripPaymentMethod })
  @IsOptional()
  @IsEnum(OpenTripPaymentMethod)
  firstPaymentMethod?: OpenTripPaymentMethod;
}

export class RegisterOpenTripDto {
  @ApiProperty()
  @IsMongoId()
  openTripId: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  bookerName: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  bookerPhone: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  meetingPointId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pax: number;

  @ApiProperty({ type: [OpenTripParticipantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpenTripParticipantDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(40)
  participants: OpenTripParticipantDto[];

  @ApiPropertyOptional({ type: [OpenTripAddonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpenTripAddonDto)
  @ArrayMaxSize(20)
  addons?: OpenTripAddonDto[];
}

export class AddOpenTripPaymentDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ enum: OpenTripPaymentMethod })
  @IsOptional()
  @IsEnum(OpenTripPaymentMethod)
  method?: OpenTripPaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  note?: string;
}

export class QueryOpenTripBookingDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  openTripId?: string;

  @ApiPropertyOptional({ enum: OpenTripBookingStatus })
  @IsOptional()
  @IsEnum(OpenTripBookingStatus)
  bookingStatus?: OpenTripBookingStatus;

  @ApiPropertyOptional({
    example: '2026-02-01',
    description: 'Trip start date from (YYYY-MM-DD)',
  })
  @IsOptional()
  @Matches(DATE_YMD)
  from?: string;

  @ApiPropertyOptional({
    example: '2026-02-28',
    description: 'Trip start date to (YYYY-MM-DD)',
  })
  @IsOptional()
  @Matches(DATE_YMD)
  to?: string;
}

export class UpdateOpenTripBookingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  openTripId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  bookerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  bookerPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsEmail()
  @MaxLength(120)
  bookerEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  meetingPointId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pax?: number;

  @ApiPropertyOptional({ type: [OpenTripParticipantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpenTripParticipantDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(40)
  participants?: OpenTripParticipantDto[];

  @ApiPropertyOptional({ type: [OpenTripAddonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpenTripAddonDto)
  @ArrayMaxSize(20)
  addons?: OpenTripAddonDto[];

  @ApiPropertyOptional({ enum: OpenTripBookingStatus })
  @IsOptional()
  @IsEnum(OpenTripBookingStatus)
  bookingStatus?: OpenTripBookingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
