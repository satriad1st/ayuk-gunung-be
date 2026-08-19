import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Permission } from '../../common/constants/permissions';
import type { AdminAuthUser } from '../../common/interfaces/auth-admin.interface';
import { AdminAuthService } from './admin-auth.service';
import { AdminService } from './admin.service';
import { AdminAccess } from './decorators/admin-access.decorator';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import { AdminLoginDto } from './dto/admin-login.dto';
import {
  AdminAuthResponseDto,
  AdminProfileResponseDto,
} from './dto/admin-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly adminService: AdminService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiOkResponse({ type: AdminAuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiForbiddenResponse({ description: 'Account is banned or inactive' })
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto);
  }

  @Get('me')
  @AdminAccess(Permission.DASHBOARD_READ)
  @ApiOperation({
    summary: 'Get current admin profile, permissions, and menus',
  })
  @ApiOkResponse({ type: AdminProfileResponseDto })
  async me(@CurrentAdmin() actor: AdminAuthUser) {
    const admin = await this.adminService.findById(actor.id);
    return this.adminService.toProfile(admin);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @AdminAccess(Permission.DASHBOARD_READ)
  @ApiOperation({ summary: 'Change the current admin password' })
  @ApiOkResponse({
    schema: { example: { message: 'Password updated successfully' } },
  })
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentAdmin() actor: AdminAuthUser,
  ) {
    await this.adminService.changePassword(actor.id, dto);
    return { message: 'Password updated successfully' };
  }
}
