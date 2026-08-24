import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryCityDto } from './dto/query-city.dto';
import { RegionsService } from './regions.service';

@ApiTags('Public Regions')
@Controller('public/regions')
export class PublicRegionsController {
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
