import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MountainsModule } from '../mountains/mountains.module';
import { UsersModule } from '../users/users.module';
import { OpenTripAdminController } from './open-trip-admin.controller';
import { OpenTripBookingsAdminController } from './open-trip-bookings-admin.controller';
import { OpenTripBookingsService } from './open-trip-bookings.service';
import { OpenTripUserController } from './open-trip-user.controller';
import { OpenTripService } from './open-trip.service';
import {
  OpenTripBooking,
  OpenTripBookingSchema,
} from './schemas/open-trip-booking.schema';
import { OpenTrip, OpenTripSchema } from './schemas/open-trip.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OpenTrip.name, schema: OpenTripSchema },
      { name: OpenTripBooking.name, schema: OpenTripBookingSchema },
    ]),
    MountainsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [
    OpenTripAdminController,
    OpenTripBookingsAdminController,
    OpenTripUserController,
  ],
  providers: [OpenTripService, OpenTripBookingsService],
  exports: [OpenTripService],
})
export class OpenTripModule {}
