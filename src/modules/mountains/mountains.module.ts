import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionsModule } from '../regions/regions.module';
import { StorageModule } from '../storage/storage.module';
import { MountainsController } from './mountains.controller';
import { MountainsService } from './mountains.service';
import { Mountain, MountainSchema } from './schemas/mountain.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mountain.name, schema: MountainSchema },
    ]),
    RegionsModule,
    StorageModule,
  ],
  controllers: [MountainsController],
  providers: [MountainsService],
  exports: [MountainsService],
})
export class MountainsModule {}
