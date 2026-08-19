import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugify } from '../../common/utils/slugify';
import { RegionsService } from './regions.service';
import { CityType } from './schemas/city.schema';

interface ProvinceSeed {
  id: string;
  name: string;
}

interface RegencySeed {
  id: string;
  provinceId: string;
  name: string;
}

@Injectable()
export class RegionsSeedService implements OnModuleInit {
  private readonly logger = new Logger(RegionsSeedService.name);

  constructor(private readonly regionsService: RegionsService) {}

  async onModuleInit() {
    const existing = await this.regionsService.countProvinces();
    if (existing > 0) {
      return;
    }

    const dataDir = join(process.cwd(), 'data', 'regions');
    const provinces = this.readJson<ProvinceSeed[]>(
      join(dataDir, 'provinces.json'),
    );
    const regencies = this.readJson<RegencySeed[]>(
      join(dataDir, 'regencies.json'),
    );

    const insertedProvinces = await this.regionsService.insertProvinces(
      provinces.map((province) => ({
        code: province.id,
        name: province.name,
        slug: slugify(province.name),
      })),
    );

    const provinceIdByCode = new Map(
      insertedProvinces.map((province) => [province.code, province._id]),
    );

    await this.regionsService.insertCities(
      regencies.map((regency) => ({
        code: regency.id,
        name: regency.name,
        slug: `${slugify(regency.name)}-${regency.id}`,
        type: this.resolveCityType(regency.name),
        province: provinceIdByCode.get(regency.provinceId)!,
      })),
    );

    this.logger.log(
      `Seeded ${provinces.length} provinces and ${regencies.length} cities`,
    );
  }

  private resolveCityType(name: string): CityType {
    return name.toLowerCase().startsWith('kota')
      ? CityType.KOTA
      : CityType.KABUPATEN;
  }

  private readJson<T>(path: string): T {
    return JSON.parse(readFileSync(path, 'utf8')) as T;
  }
}
