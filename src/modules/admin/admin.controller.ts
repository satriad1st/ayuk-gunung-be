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
import { AdminService } from './admin.service';
import { AdminAccess } from './decorators/admin-access.decorator';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import { BanAdminDto } from './dto/ban-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import {
  AdminListResponseDto,
  AdminResponseDto,
} from './dto/admin-response.dto';
import { QueryAdminDto } from './dto/query-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admins')
@Controller('admin/admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @AdminAccess(Permission.ADMIN_CREATE)
  @ApiOperation({ summary: 'Create an admin account' })
  @ApiCreatedResponse({ type: AdminResponseDto })
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Get()
  @AdminAccess(Permission.ADMIN_READ)
  @ApiOperation({ summary: 'List admin accounts' })
  @ApiOkResponse({ type: AdminListResponseDto })
  findAll(@Query() query: QueryAdminDto) {
    return this.adminService.findAll(query);
  }

  @Get(':id')
  @AdminAccess(Permission.ADMIN_READ)
  @ApiOperation({ summary: 'Get an admin account by id' })
  @ApiOkResponse({ type: AdminResponseDto })
  findOne(@Param('id') id: string) {
    return this.adminService.findById(id);
  }

  @Patch(':id')
  @AdminAccess(Permission.ADMIN_UPDATE)
  @ApiOperation({ summary: 'Update an admin account' })
  @ApiOkResponse({ type: AdminResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.update(id, dto);
  }

  @Post(':id/ban')
  @AdminAccess(Permission.ADMIN_BAN)
  @ApiOperation({ summary: 'Ban an admin account for a policy violation' })
  @ApiOkResponse({ type: AdminResponseDto })
  ban(
    @Param('id') id: string,
    @Body() dto: BanAdminDto,
    @CurrentAdmin() actor: AdminAuthUser,
  ) {
    return this.adminService.ban(id, dto, actor);
  }

  @Post(':id/unban')
  @AdminAccess(Permission.ADMIN_BAN)
  @ApiOperation({ summary: 'Restore a banned admin account' })
  @ApiOkResponse({ type: AdminResponseDto })
  unban(@Param('id') id: string) {
    return this.adminService.unban(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminAccess(Permission.ADMIN_DELETE)
  @ApiOperation({ summary: 'Delete an admin account' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string, @CurrentAdmin() actor: AdminAuthUser) {
    return this.adminService.remove(id, actor);
  }
}
