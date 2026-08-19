import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { slugify } from '../../common/utils/slugify';
import { Facility } from './schemas/facility.schema';

const BASIC_FACILITIES = [
  'WiFi',
  'Parkir',
  'Kamar mandi dalam',
  'Air panas',
  'Dapur bersama',
  'Ruang tamu',
  'Halaman',
  'Mushola',
  'Laundry',
  'Sarapan',
  'AC',
  'Kipas angin',
  'TV',
  'Air mineral',
  'Penjemputan basecamp',
  'Penyimpanan barang',
  'Area jemur',
  'BBQ',
  'View gunung',
  'Dekat warung',
];

@Injectable()
export class FacilitiesSeedService implements OnModuleInit {
  private readonly logger = new Logger(FacilitiesSeedService.name);

  constructor(
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>,
  ) {}

  async onModuleInit() {
    const existing = await this.facilityModel.estimatedDocumentCount().exec();
    if (existing > 0) {
      return;
    }

    await this.facilityModel.insertMany(
      BASIC_FACILITIES.map((name) => ({
        name,
        slug: slugify(name),
      })),
    );

    this.logger.log(`Seeded ${BASIC_FACILITIES.length} homestay facilities`);
  }
}
