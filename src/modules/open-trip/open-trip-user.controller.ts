import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  OpenTripBookingResponseDto,
  UserOpenTripBookingListDto,
} from './dto/booking-response.dto';
import { RegisterOpenTripDto } from './dto/booking.dto';
import { OpenTripBookingsService } from './open-trip-bookings.service';

@ApiTags('Open Trip')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
@Controller('open-trip/registrations')
export class OpenTripUserController {
  constructor(private readonly bookingsService: OpenTripBookingsService) {}

  @Get()
  @ApiOperation({ summary: 'List open trip registrations for the logged-in user' })
  @ApiOkResponse({ type: UserOpenTripBookingListDto })
  list(@CurrentUser() user: AuthUser) {
    return this.bookingsService.findForUser(user);
  }

  @Post()
  @ApiOperation({ summary: 'Register for an open trip as a logged-in user' })
  @ApiCreatedResponse({ type: OpenTripBookingResponseDto })
  register(
    @CurrentUser() user: AuthUser,
    @Body() dto: RegisterOpenTripDto,
  ) {
    return this.bookingsService.register(user, dto);
  }
}
