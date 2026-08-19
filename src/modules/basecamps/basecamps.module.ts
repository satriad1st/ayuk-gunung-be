import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MountainsModule } from '../mountains/mountains.module';
import { StorageModule } from '../storage/storage.module';
import { BasecampsController } from './basecamps.controller';
import { BasecampsService } from './basecamps.service';
import { Basecamp, BasecampSchema } from './schemas/basecamp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Basecamp.name, schema: BasecampSchema },
    ]),
    MountainsModule,
    StorageModule,
  ],
  controllers: [BasecampsController],
  providers: [BasecampsService],
  exports: [BasecampsService],
})
export class BasecampsModule {}
