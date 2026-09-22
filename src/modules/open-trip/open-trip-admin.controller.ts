import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from '../../common/constants/permissions';
import { AdminAccess } from '../admin/decorators/admin-access.decorator';
import { CreateOpenTripDto } from './dto/create-open-trip.dto';
import {
  OpenTripListResponseDto,
  OpenTripResponseDto,
} from './dto/open-trip-response.dto';
import { QueryOpenTripDto } from './dto/query-open-trip.dto';
import { UpdateOpenTripDto } from './dto/update-open-trip.dto';
import { OpenTripService } from './open-trip.service';

@ApiTags('Open Trip')
@Controller('admin/open-trips')
export class OpenTripAdminController {
  constructor(private readonly openTripService: OpenTripService) {}

  @Post()
  @AdminAccess(Permission.OPEN_TRIP_CREATE)
  @ApiOperation({ summary: 'Create an open trip' })
  @ApiCreatedResponse({ type: OpenTripResponseDto })
  create(@Body() dto: CreateOpenTripDto) {
    return this.openTripService.create(dto);
  }

  @Get()
  @AdminAccess(Permission.OPEN_TRIP_READ)
  @ApiOperation({ summary: 'List open trips' })
  @ApiOkResponse({ type: OpenTripListResponseDto })
  findAll(@Query() query: QueryOpenTripDto) {
    return this.openTripService.findAll(query);
  }

  @Get('options')
  @AdminAccess(Permission.OPEN_TRIP_READ)
  @ApiOperation({ summary: 'Open trip options for booking form' })
  findOptions() {
    return this.openTripService.findOptions();
  }

  @Get(':id')
  @AdminAccess(Permission.OPEN_TRIP_READ)
  @ApiOperation({ summary: 'Get an open trip' })
  @ApiOkResponse({ type: OpenTripResponseDto })
  findOne(@Param('id') id: string) {
    return this.openTripService.findById(id);
  }

  @Patch(':id')
  @AdminAccess(Permission.OPEN_TRIP_UPDATE)
  @ApiOperation({ summary: 'Update an open trip' })
  @ApiOkResponse({ type: OpenTripResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateOpenTripDto) {
    return this.openTripService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminAccess(Permission.OPEN_TRIP_DELETE)
  @ApiOperation({ summary: 'Delete an open trip' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.openTripService.remove(id);
  }
}
