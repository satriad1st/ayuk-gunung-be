import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MountainsModule } from '../mountains/mountains.module';
import { PrivateTripBookingsService } from './private-trip-bookings.service';
import { PrivateTripController } from './private-trip.controller';
import { PrivateTripSeedService } from './private-trip.seed';
import { PrivateTripService } from './private-trip.service';
import {
  PrivateTripBooking,
  PrivateTripBookingSchema,
} from './schemas/private-trip-booking.schema';
import {
  PrivateTripContent,
  PrivateTripContentSchema,
} from './schemas/private-trip.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrivateTripContent.name, schema: PrivateTripContentSchema },
      { name: PrivateTripBooking.name, schema: PrivateTripBookingSchema },
    ]),
    MountainsModule,
  ],
  controllers: [PrivateTripController],
  providers: [
    PrivateTripService,
    PrivateTripSeedService,
    PrivateTripBookingsService,
  ],
  exports: [PrivateTripService],
})
export class PrivateTripModule {}
