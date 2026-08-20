import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivateTripController } from './private-trip.controller';
import { PrivateTripSeedService } from './private-trip.seed';
import { PrivateTripService } from './private-trip.service';
import {
  PrivateTripContent,
  PrivateTripContentSchema,
} from './schemas/private-trip.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrivateTripContent.name, schema: PrivateTripContentSchema },
    ]),
  ],
  controllers: [PrivateTripController],
  providers: [PrivateTripService, PrivateTripSeedService],
  exports: [PrivateTripService],
})
export class PrivateTripModule {}
