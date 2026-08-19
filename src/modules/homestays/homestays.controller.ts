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
import type { AdminAuthUser } from '../../common/interfaces/auth-admin.interface';
import { AdminAccess } from '../admin/decorators/admin-access.decorator';
import { CurrentAdmin } from '../admin/decorators/current-admin.decorator';
import { MountainsService } from '../mountains/mountains.service';
import { CreateHomestayDto } from './dto/create-homestay.dto';
import {
  HomestayListResponseDto,
  HomestayResponseDto,
} from './dto/homestay-response.dto';
import { QueryHomestayDto } from './dto/query-homestay.dto';
import { UpdateHomestayDto } from './dto/update-homestay.dto';
import { HomestaysService } from './homestays.service';

@ApiTags('Homestays')
@Controller('admin/homestays')
export class HomestaysController {
  constructor(
    private readonly homestaysService: HomestaysService,
    private readonly mountainsService: MountainsService,
  ) {}

  @Get('lookups/facilities')
  @AdminAccess(Permission.HOMESTAY_READ)
  @ApiOperation({ summary: 'List seeded homestay facilities' })
  facilities() {
    return this.homestaysService.findFacilities();
  }

  @Get('lookups/mountains')
  @AdminAccess(Permission.HOMESTAY_READ)
  @ApiOperation({ summary: 'List mountains that can be linked to a homestay' })
  mountains() {
    return this.mountainsService.findOptions();
  }

  @Post()
  @AdminAccess(Permission.HOMESTAY_CREATE)
  @ApiOperation({ summary: 'Create a homestay' })
  @ApiCreatedResponse({ type: HomestayResponseDto })
  create(@Body() dto: CreateHomestayDto, @CurrentAdmin() actor: AdminAuthUser) {
    return this.homestaysService.create(dto, actor);
  }

  @Get()
  @AdminAccess(Permission.HOMESTAY_READ)
  @ApiOperation({ summary: 'List homestays with pagination' })
  @ApiOkResponse({ type: HomestayListResponseDto })
  findAll(
    @Query() query: QueryHomestayDto,
    @CurrentAdmin() actor: AdminAuthUser,
  ) {
    return this.homestaysService.findAll(query, actor);
  }

  @Get(':id')
  @AdminAccess(Permission.HOMESTAY_READ)
  @ApiOperation({ summary: 'Get a homestay by id' })
  @ApiOkResponse({ type: HomestayResponseDto })
  findOne(@Param('id') id: string, @CurrentAdmin() actor: AdminAuthUser) {
    return this.homestaysService.findById(id, actor);
  }

  @Patch(':id')
  @AdminAccess(Permission.HOMESTAY_UPDATE)
  @ApiOperation({ summary: 'Update a homestay' })
  @ApiOkResponse({ type: HomestayResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHomestayDto,
    @CurrentAdmin() actor: AdminAuthUser,
  ) {
    return this.homestaysService.update(id, dto, actor);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminAccess(Permission.HOMESTAY_DELETE)
  @ApiOperation({ summary: 'Delete a homestay and its rooms' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string, @CurrentAdmin() actor: AdminAuthUser) {
    return this.homestaysService.remove(id, actor);
  }
}
