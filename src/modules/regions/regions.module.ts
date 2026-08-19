import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionsController } from './regions.controller';
import { RegionsSeedService } from './regions.seed';
import { RegionsService } from './regions.service';
import { City, CitySchema } from './schemas/city.schema';
import { Province, ProvinceSchema } from './schemas/province.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Province.name, schema: ProvinceSchema },
      { name: City.name, schema: CitySchema },
    ]),
  ],
  controllers: [RegionsController],
  providers: [RegionsService, RegionsSeedService],
  exports: [RegionsService],
})
export class RegionsModule {}
