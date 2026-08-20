import { Module } from '@nestjs/common';
import { BasecampsModule } from '../basecamps/basecamps.module';
import { HomestaysModule } from '../homestays/homestays.module';
import { MountainsModule } from '../mountains/mountains.module';
import { PrivateTripModule } from '../private-trip/private-trip.module';
import { PublicCatalogController } from './public-catalog.controller';
import { PublicRateLimitInterceptor } from './public-rate-limit.interceptor';

@Module({
  imports: [
    MountainsModule,
    BasecampsModule,
    HomestaysModule,
    PrivateTripModule,
  ],
  controllers: [PublicCatalogController],
  providers: [PublicRateLimitInterceptor],
})
export class PublicCatalogModule {}
