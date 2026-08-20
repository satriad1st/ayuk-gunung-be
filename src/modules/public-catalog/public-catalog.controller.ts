import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { distanceKm } from '../../common/utils/geo';
import { BasecampsService } from '../basecamps/basecamps.service';
import { HomestaysService } from '../homestays/homestays.service';
import { MountainsService } from '../mountains/mountains.service';
import { PrivateTripService } from '../private-trip/private-trip.service';
import {
  QueryPublicMountainDto,
  QueryPublicSearchDto,
} from './dto/query-public.dto';
import { PublicRateLimitInterceptor } from './public-rate-limit.interceptor';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

@ApiTags('Public Catalog')
@UseInterceptors(PublicRateLimitInterceptor)
@Controller('public')
export class PublicCatalogController {
  constructor(
    private readonly mountainsService: MountainsService,
    private readonly basecampsService: BasecampsService,
    private readonly homestaysService: HomestaysService,
    private readonly privateTripService: PrivateTripService,
  ) {}

  @Get('provinces')
  @ApiOperation({ summary: 'Provinces that currently have mountains' })
  provinces() {
    return this.mountainsService.findPublicProvinces();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search mountains, basecamps, and homestays',
  })
  search(@Query() query: QueryPublicSearchDto) {
    const keyword = query.q?.trim() ?? '';
    return Promise.all([
      this.mountainsService.searchPublic(keyword),
      this.basecampsService.searchPublic(keyword),
      this.homestaysService.searchPublic(keyword),
    ]).then(([mountains, basecamps, homestays]) => ({
      mountains,
      basecamps,
      homestays,
    }));
  }

  @Get('mountains')
  @ApiOperation({ summary: 'List mountains' })
  @ApiOkResponse()
  mountains(@Query() query: QueryPublicMountainDto) {
    return this.mountainsService.findPublic(query);
  }

  @Get('mountains/:slug')
  @ApiOperation({ summary: 'Mountain detail with its basecamps' })
  async mountain(@Param('slug') slug: string) {
    this.assertSlug(slug);
    const mountain = await this.mountainsService.findPublicBySlug(slug);
    const basecamps = await this.basecampsService.findPublicByMountain(
      mountain.id,
    );
    return { mountain, basecamps };
  }

  @Get('basecamps/:slug')
  @ApiOperation({
    summary: 'Basecamp detail with nearby homestays for the same mountain',
  })
  async basecamp(@Param('slug') slug: string) {
    this.assertSlug(slug);
    const basecamp = await this.basecampsService.findPublicBySlug(slug);
    const homestays = await this.homestaysService.findPublicByMountain(
      basecamp.mountain.id,
    );
    const nearby = homestays
      .map((homestay) => ({
        ...homestay,
        distanceKm: distanceKm(basecamp, homestay),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return { basecamp, homestays: nearby };
  }

  @Get('private-trip')
  @ApiOperation({ summary: 'Private trip landing content' })
  privateTrip() {
    return this.privateTripService.get();
  }

  @Get('homestays/:slug')
  @ApiOperation({ summary: 'Homestay detail with rooms' })
  homestay(@Param('slug') slug: string) {
    this.assertSlug(slug);
    return this.homestaysService.findPublicBySlug(slug);
  }

  private assertSlug(slug: string) {
    if (!SLUG_PATTERN.test(slug)) {
      throw new BadRequestException('Invalid slug');
    }
  }
}
