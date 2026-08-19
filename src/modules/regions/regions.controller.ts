import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../admin/guards/admin-jwt-auth.guard';
import { QueryCityDto } from './dto/query-city.dto';
import { RegionsService } from './regions.service';

@ApiTags('Regions')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard)
@Controller('admin/regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get('provinces')
  @ApiOperation({ summary: 'List all provinces' })
  @ApiOkResponse({ description: 'Province list' })
  findProvinces() {
    return this.regionsService.findProvinces();
  }

  @Get('cities')
  @ApiOperation({ summary: 'List cities/kabupaten by province' })
  @ApiOkResponse({ description: 'City list' })
  findCities(@Query() query: QueryCityDto) {
    return this.regionsService.findCitiesByProvince(query.provinceId);
  }
}
