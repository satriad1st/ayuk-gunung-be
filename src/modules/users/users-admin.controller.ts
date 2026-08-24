import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '../../common/constants/permissions';
import type { AdminAuthUser } from '../../common/interfaces/auth-admin.interface';
import { AdminAccess } from '../admin/decorators/admin-access.decorator';
import { CurrentAdmin } from '../admin/decorators/current-admin.decorator';
import { BanAdminDto } from '../admin/dto/ban-admin.dto';
import {
  UserListResponseDto,
  UserResponseDto,
} from '../auth/dto/auth-response.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UsersAdminService } from './users-admin.service';

@ApiTags('Users')
@Controller('admin/users')
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  @Get()
  @AdminAccess(Permission.USER_READ)
  @ApiOperation({ summary: 'List registered app users' })
  @ApiOkResponse({ type: UserListResponseDto })
  findAll(@Query() query: QueryUserDto) {
    return this.usersAdminService.findAll(query);
  }

  @Get(':id')
  @AdminAccess(Permission.USER_READ)
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiOkResponse({ type: UserResponseDto })
  findOne(@Param('id') id: string) {
    return this.usersAdminService.findById(id);
  }

  @Post(':id/ban')
  @AdminAccess(Permission.USER_BAN)
  @ApiOperation({ summary: 'Ban a user so they cannot log in' })
  @ApiOkResponse({ type: UserResponseDto })
  ban(
    @Param('id') id: string,
    @Body() dto: BanAdminDto,
    @CurrentAdmin() actor: AdminAuthUser,
  ) {
    return this.usersAdminService.ban(id, dto, actor);
  }

  @Post(':id/unban')
  @AdminAccess(Permission.USER_BAN)
  @ApiOperation({ summary: 'Restore a banned user' })
  @ApiOkResponse({ type: UserResponseDto })
  unban(@Param('id') id: string) {
    return this.usersAdminService.unban(id);
  }
}
