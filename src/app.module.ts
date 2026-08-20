import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BasecampsModule } from './modules/basecamps/basecamps.module';
import { HealthModule } from './modules/health/health.module';
import { HomestaysModule } from './modules/homestays/homestays.module';
import { MountainsModule } from './modules/mountains/mountains.module';
import { PrivateTripModule } from './modules/private-trip/private-trip.module';
import { PublicCatalogModule } from './modules/public-catalog/public-catalog.module';
import { RegionsModule } from './modules/regions/regions.module';
import { StorageModule } from './modules/storage/storage.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      load: [configuration],
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('mongodbUri'),
      }),
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    AdminModule,
    RegionsModule,
    StorageModule,
    MountainsModule,
    BasecampsModule,
    HomestaysModule,
    PrivateTripModule,
    PublicCatalogModule,
  ],
})
export class AppModule {}
