import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MountainsModule } from '../mountains/mountains.module';
import { RegionsModule } from '../regions/regions.module';
import { StorageModule } from '../storage/storage.module';
import { FacilitiesSeedService } from './facilities.seed';
import { HomestaysController } from './homestays.controller';
import { HomestaysService } from './homestays.service';
import { RoomsController } from './rooms.controller';
import { Facility, FacilitySchema } from './schemas/facility.schema';
import { Homestay, HomestaySchema } from './schemas/homestay.schema';
import { Room, RoomSchema } from './schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Homestay.name, schema: HomestaySchema },
      { name: Room.name, schema: RoomSchema },
      { name: Facility.name, schema: FacilitySchema },
    ]),
    RegionsModule,
    MountainsModule,
    StorageModule,
  ],
  controllers: [HomestaysController, RoomsController],
  providers: [HomestaysService, FacilitiesSeedService],
  exports: [HomestaysService],
})
export class HomestaysModule {}
