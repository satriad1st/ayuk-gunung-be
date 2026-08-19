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
import { CreateMountainDto } from './dto/create-mountain.dto';
import {
  MountainListResponseDto,
  MountainResponseDto,
} from './dto/mountain-response.dto';
import { QueryMountainDto } from './dto/query-mountain.dto';
import { UpdateMountainDto } from './dto/update-mountain.dto';
import { MountainsService } from './mountains.service';

@ApiTags('Mountains')
@Controller('admin/mountains')
export class MountainsController {
  constructor(private readonly mountainsService: MountainsService) {}

  @Post()
  @AdminAccess(Permission.MOUNTAIN_CREATE)
  @ApiOperation({ summary: 'Create a mountain' })
  @ApiCreatedResponse({ type: MountainResponseDto })
  create(@Body() dto: CreateMountainDto) {
    return this.mountainsService.create(dto);
  }

  @Get()
  @AdminAccess(Permission.MOUNTAIN_READ)
  @ApiOperation({ summary: 'List mountains with pagination' })
  @ApiOkResponse({ type: MountainListResponseDto })
  findAll(@Query() query: QueryMountainDto) {
    return this.mountainsService.findAll(query);
  }

  @Get('options')
  @AdminAccess(Permission.MOUNTAIN_READ)
  @ApiOperation({ summary: 'List active mountains for select options' })
  findOptions() {
    return this.mountainsService.findOptions();
  }

  @Get(':id')
  @AdminAccess(Permission.MOUNTAIN_READ)
  @ApiOperation({ summary: 'Get a mountain by id' })
  @ApiOkResponse({ type: MountainResponseDto })
  findOne(@Param('id') id: string) {
    return this.mountainsService.findById(id);
  }

  @Patch(':id')
  @AdminAccess(Permission.MOUNTAIN_UPDATE)
  @ApiOperation({ summary: 'Update a mountain' })
  @ApiOkResponse({ type: MountainResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateMountainDto) {
    return this.mountainsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminAccess(Permission.MOUNTAIN_DELETE)
  @ApiOperation({ summary: 'Delete a mountain' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.mountainsService.remove(id);
  }
}
