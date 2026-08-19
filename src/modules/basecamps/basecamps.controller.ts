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
import { BasecampsService } from './basecamps.service';
import {
  BasecampListResponseDto,
  BasecampResponseDto,
} from './dto/basecamp-response.dto';
import { CreateBasecampDto } from './dto/create-basecamp.dto';
import { QueryBasecampDto } from './dto/query-basecamp.dto';
import { UpdateBasecampDto } from './dto/update-basecamp.dto';

@ApiTags('Basecamps')
@Controller('admin/basecamps')
export class BasecampsController {
  constructor(private readonly basecampsService: BasecampsService) {}

  @Post()
  @AdminAccess(Permission.BASECAMP_CREATE)
  @ApiOperation({ summary: 'Create a basecamp' })
  @ApiCreatedResponse({ type: BasecampResponseDto })
  create(@Body() dto: CreateBasecampDto) {
    return this.basecampsService.create(dto);
  }

  @Get()
  @AdminAccess(Permission.BASECAMP_READ)
  @ApiOperation({ summary: 'List basecamps with pagination' })
  @ApiOkResponse({ type: BasecampListResponseDto })
  findAll(@Query() query: QueryBasecampDto) {
    return this.basecampsService.findAll(query);
  }

  @Get(':id')
  @AdminAccess(Permission.BASECAMP_READ)
  @ApiOperation({ summary: 'Get a basecamp by id' })
  @ApiOkResponse({ type: BasecampResponseDto })
  findOne(@Param('id') id: string) {
    return this.basecampsService.findById(id);
  }

  @Patch(':id')
  @AdminAccess(Permission.BASECAMP_UPDATE)
  @ApiOperation({ summary: 'Update a basecamp' })
  @ApiOkResponse({ type: BasecampResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateBasecampDto) {
    return this.basecampsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminAccess(Permission.BASECAMP_DELETE)
  @ApiOperation({ summary: 'Delete a basecamp' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.basecampsService.remove(id);
  }
}
