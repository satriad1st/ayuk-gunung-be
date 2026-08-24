import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserPrivateTripBookingListDto } from './dto/user-booking-response.dto';
import { PrivateTripBookingsService } from './private-trip-bookings.service';

@ApiTags('Private Trip')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
@Controller('private-trip/bookings')
export class PrivateTripUserBookingsController {
  constructor(
    private readonly bookingsService: PrivateTripBookingsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List private trip bookings for the logged-in user email',
  })
  @ApiOkResponse({ type: UserPrivateTripBookingListDto })
  list(@CurrentUser() user: AuthUser) {
    return this.bookingsService.findForUser(user.email);
  }
}
