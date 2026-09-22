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
import {
  OpenTripBookingListResponseDto,
  OpenTripBookingResponseDto,
} from './dto/booking-response.dto';
import {
  AddOpenTripPaymentDto,
  CreateOpenTripBookingDto,
  QueryOpenTripBookingDto,
  UpdateOpenTripBookingDto,
} from './dto/booking.dto';
import { OpenTripBookingsService } from './open-trip-bookings.service';

@ApiTags('Open Trip')
@Controller('admin/open-trip-bookings')
export class OpenTripBookingsAdminController {
  constructor(private readonly bookingsService: OpenTripBookingsService) {}

  @Get()
  @AdminAccess(Permission.OPEN_TRIP_READ)
  @ApiOperation({ summary: 'List open trip registrations' })
  @ApiOkResponse({ type: OpenTripBookingListResponseDto })
  findAll(@Query() query: QueryOpenTripBookingDto) {
    return this.bookingsService.findAll(query);
  }

  @Post()
  @AdminAccess(Permission.OPEN_TRIP_BOOKING_CREATE)
  @ApiOperation({ summary: 'Create an open trip registration' })
  @ApiCreatedResponse({ type: OpenTripBookingResponseDto })
  create(@Body() dto: CreateOpenTripBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get(':id')
  @AdminAccess(Permission.OPEN_TRIP_READ)
  @ApiOperation({ summary: 'Get an open trip registration' })
  @ApiOkResponse({ type: OpenTripBookingResponseDto })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Patch(':id')
  @AdminAccess(Permission.OPEN_TRIP_BOOKING_UPDATE)
  @ApiOperation({ summary: 'Update an open trip registration' })
  @ApiOkResponse({ type: OpenTripBookingResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateOpenTripBookingDto) {
    return this.bookingsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminAccess(Permission.OPEN_TRIP_BOOKING_DELETE)
  @ApiOperation({ summary: 'Delete an open trip registration' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }

  @Post(':id/payments')
  @AdminAccess(Permission.OPEN_TRIP_BOOKING_UPDATE)
  @ApiOperation({ summary: 'Add a payment to a registration' })
  @ApiOkResponse({ type: OpenTripBookingResponseDto })
  addPayment(@Param('id') id: string, @Body() dto: AddOpenTripPaymentDto) {
    return this.bookingsService.addPayment(id, dto);
  }

  @Delete(':id/payments/:paymentId')
  @AdminAccess(Permission.OPEN_TRIP_BOOKING_UPDATE)
  @ApiOperation({ summary: 'Remove a payment from a registration' })
  @ApiOkResponse({ type: OpenTripBookingResponseDto })
  removePayment(
    @Param('id') id: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.bookingsService.removePayment(id, paymentId);
  }
}
