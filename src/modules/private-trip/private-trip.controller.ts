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
import { AddBookingPaymentDto } from './dto/add-payment.dto';
import {
  PrivateTripBookingListResponseDto,
  PrivateTripBookingResponseDto,
} from './dto/booking-response.dto';
import { CreatePrivateTripBookingDto } from './dto/create-booking.dto';
import { PrivateTripResponseDto } from './dto/private-trip-response.dto';
import { QueryPrivateTripBookingDto } from './dto/query-booking.dto';
import { UpdatePrivateTripBookingDto } from './dto/update-booking.dto';
import { UpdatePrivateTripDto } from './dto/update-private-trip.dto';
import { PrivateTripBookingsService } from './private-trip-bookings.service';
import { PrivateTripService } from './private-trip.service';

@ApiTags('Private Trip')
@Controller('admin/private-trip')
export class PrivateTripController {
  constructor(
    private readonly privateTripService: PrivateTripService,
    private readonly bookingsService: PrivateTripBookingsService,
  ) {}

  @Get('bookings')
  @AdminAccess(Permission.PRIVATE_TRIP_READ)
  @ApiOperation({ summary: 'List private trip bookings for a date range' })
  @ApiOkResponse({ type: PrivateTripBookingListResponseDto })
  findBookings(@Query() query: QueryPrivateTripBookingDto) {
    return this.bookingsService.findAll(query);
  }

  @Post('bookings')
  @AdminAccess(Permission.PRIVATE_TRIP_BOOKING_CREATE)
  @ApiOperation({ summary: 'Create a private trip booking' })
  @ApiCreatedResponse({ type: PrivateTripBookingResponseDto })
  createBooking(@Body() dto: CreatePrivateTripBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get('bookings/:id')
  @AdminAccess(Permission.PRIVATE_TRIP_READ)
  @ApiOperation({ summary: 'Get a private trip booking' })
  @ApiOkResponse({ type: PrivateTripBookingResponseDto })
  findBooking(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Patch('bookings/:id')
  @AdminAccess(Permission.PRIVATE_TRIP_BOOKING_UPDATE)
  @ApiOperation({ summary: 'Update a private trip booking' })
  @ApiOkResponse({ type: PrivateTripBookingResponseDto })
  updateBooking(
    @Param('id') id: string,
    @Body() dto: UpdatePrivateTripBookingDto,
  ) {
    return this.bookingsService.update(id, dto);
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminAccess(Permission.PRIVATE_TRIP_BOOKING_DELETE)
  @ApiOperation({ summary: 'Delete a private trip booking' })
  @ApiNoContentResponse()
  removeBooking(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }

  @Post('bookings/:id/payments')
  @AdminAccess(Permission.PRIVATE_TRIP_BOOKING_UPDATE)
  @ApiOperation({ summary: 'Add a payment to a booking' })
  @ApiOkResponse({ type: PrivateTripBookingResponseDto })
  addPayment(
    @Param('id') id: string,
    @Body() dto: AddBookingPaymentDto,
  ) {
    return this.bookingsService.addPayment(id, dto);
  }

  @Delete('bookings/:id/payments/:paymentId')
  @AdminAccess(Permission.PRIVATE_TRIP_BOOKING_UPDATE)
  @ApiOperation({ summary: 'Remove a payment from a booking' })
  @ApiOkResponse({ type: PrivateTripBookingResponseDto })
  removePayment(
    @Param('id') id: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.bookingsService.removePayment(id, paymentId);
  }

  @Get()
  @AdminAccess(Permission.PRIVATE_TRIP_READ)
  @ApiOperation({ summary: 'Get private trip landing content' })
  @ApiOkResponse({ type: PrivateTripResponseDto })
  get() {
    return this.privateTripService.get();
  }

  @Patch()
  @AdminAccess(Permission.PRIVATE_TRIP_UPDATE)
  @ApiOperation({ summary: 'Update private trip landing content' })
  @ApiOkResponse({ type: PrivateTripResponseDto })
  update(@Body() dto: UpdatePrivateTripDto) {
    return this.privateTripService.update(dto);
  }
}
