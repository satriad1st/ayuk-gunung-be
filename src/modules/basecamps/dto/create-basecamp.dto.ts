import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  BasecampOpenStatus,
  BasecampStatus,
  OpenDaysType,
  OvernightStay,
  SimaksiType,
  TrashCheck,
  WEEKDAYS,
} from '../schemas/basecamp.schema';

function nullableNumber({ value, obj, key }: TransformFnParams) {
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    return undefined;
  }

  if (value === '' || value === null) {
    return null;
  }

  return Number(value);
}

function nullableUrl({ value, obj, key }: TransformFnParams) {
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    return undefined;
  }

  if (value === '' || value === null) {
    return null;
  }

  return typeof value === 'string' ? value.trim() : value;
}

export class RouteSegmentDto {
  @ApiProperty({ example: 'Basecamp' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  fromName: string;

  @ApiProperty({ example: 'Pos 1' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  toName: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Transform(nullableNumber)
  @IsNumber()
  @Min(0)
  elevationGain?: number | null;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(nullableNumber)
  @IsNumber()
  @Min(0)
  distanceKm?: number | null;

  @ApiPropertyOptional({ example: 40, description: 'Duration in minutes' })
  @IsOptional()
  @Transform(nullableNumber)
  @IsNumber()
  @Min(0)
  durationMinutesMin?: number | null;

  @ApiPropertyOptional({ example: 45, description: 'Duration in minutes' })
  @IsOptional()
  @Transform(nullableNumber)
  @IsNumber()
  @Min(0)
  durationMinutesMax?: number | null;
}

export class CreateBasecampDto {
  @ApiProperty({ example: 'Basecamp Ranu Pani' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'Desa Ranu Pani, Senduro, Lumajang' })
  @IsString()
  @MinLength(5)
  @MaxLength(250)
  address: string;

  @ApiProperty({ example: 'Pak Slamet' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  contactName: string;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  contactPhone: string;

  @ApiProperty()
  @IsMongoId()
  mountainId: string;

  @ApiProperty({ example: -8.0145 })
  @Type(() => Number)
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 112.9172 })
  @Type(() => Number)
  @IsLongitude()
  longitude: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: '/uploads/gpx/2026/08/track.gpx' })
  @IsOptional()
  @IsString()
  gpxFile?: string;

  @ApiPropertyOptional({ example: 'jalur-ranu-pani.gpx' })
  @IsOptional()
  @IsString()
  gpxFileName?: string;

  @ApiProperty({ enum: OvernightStay, example: OvernightStay.CAN })
  @IsEnum(OvernightStay)
  overnightStay: OvernightStay;

  @ApiPropertyOptional({
    example: 35000,
    description: 'Harga simaksi jika diketahui',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  simaksiPrice?: number;

  @ApiPropertyOptional({
    enum: SimaksiType,
    default: SimaksiType.ON_SITE,
    description: 'Jenis simaksi: online atau di lokasi',
  })
  @IsOptional()
  @IsEnum(SimaksiType)
  simaksiType?: SimaksiType;

  @ApiPropertyOptional({
    example: 'https://simaksi.example.com/daftar',
    description: 'Link registrasi simaksi, wajib jika jenisnya online',
  })
  @ValidateIf(
    (dto: CreateBasecampDto) => dto.simaksiType === SimaksiType.ONLINE,
  )
  @Transform(nullableUrl)
  @IsNotEmpty({
    message: 'simaksiRegistrationUrl is required when simaksi is online',
  })
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MaxLength(500)
  simaksiRegistrationUrl?: string | null;

  @ApiProperty({ enum: TrashCheck, example: TrashCheck.AVAILABLE })
  @IsEnum(TrashCheck)
  trashCheck: TrashCheck;

  @ApiPropertyOptional({ enum: BasecampStatus, default: BasecampStatus.ACTIVE })
  @IsOptional()
  @IsEnum(BasecampStatus)
  status?: BasecampStatus;

  @ApiPropertyOptional({
    enum: BasecampOpenStatus,
    default: BasecampOpenStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(BasecampOpenStatus)
  openStatus?: BasecampOpenStatus;

  @ApiPropertyOptional({
    enum: OpenDaysType,
    default: OpenDaysType.EVERYDAY,
  })
  @IsOptional()
  @IsEnum(OpenDaysType)
  openDaysType?: OpenDaysType;

  @ApiPropertyOptional({ example: ['saturday', 'sunday'] })
  @ValidateIf((dto: CreateBasecampDto) => dto.openDaysType === OpenDaysType.CUSTOM)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn([...WEEKDAYS], { each: true })
  openDays?: string[];

  @ApiPropertyOptional({ example: '07:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'openTimeFrom must be HH:mm',
  })
  openTimeFrom?: string | null;

  @ApiPropertyOptional({ example: '16:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'openTimeTo must be HH:mm',
  })
  openTimeTo?: string | null;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  tektokAllowed?: boolean;

  @ApiPropertyOptional({ example: '00:00' })
  @ValidateIf((dto: CreateBasecampDto) => dto.tektokAllowed === true)
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'tektokDeadline must be HH:mm',
  })
  tektokDeadline?: string | null;

  @ApiPropertyOptional({ example: 2200, description: 'Elevation gain in meters' })
  @IsOptional()
  @Transform(nullableNumber)
  @IsNumber()
  @Min(0)
  elevationGain?: number | null;

  @ApiPropertyOptional({ example: 12.5, description: 'Trail distance in km' })
  @IsOptional()
  @Transform(nullableNumber)
  @IsNumber()
  @Min(0)
  distanceKm?: number | null;

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @Transform(nullableNumber)
  @IsNumber()
  @Min(0)
  durationHoursMin?: number | null;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @Transform(nullableNumber)
  @IsNumber()
  @Min(0)
  durationHoursMax?: number | null;

  @ApiPropertyOptional({ type: [RouteSegmentDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => RouteSegmentDto)
  routeSegments?: RouteSegmentDto[];
}
