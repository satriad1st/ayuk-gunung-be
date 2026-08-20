import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePrivateTripDto } from './dto/update-private-trip.dto';
import { PrivateTripResponseDto } from './dto/private-trip-response.dto';
import { PRIVATE_TRIP_SEED } from './private-trip.seed-data';
import {
  PRIVATE_TRIP_KEY,
  PrivateTripContent,
  PrivateTripDocument,
  TRIP_PACKAGE_KEYS,
} from './schemas/private-trip.schema';

@Injectable()
export class PrivateTripService {
  constructor(
    @InjectModel(PrivateTripContent.name)
    private readonly model: Model<PrivateTripDocument>,
  ) {}

  async get(): Promise<PrivateTripResponseDto> {
    const doc = await this.ensureDocument();
    return this.toResponse(doc);
  }

  async update(dto: UpdatePrivateTripDto): Promise<PrivateTripResponseDto> {
    this.assertPackages(dto.packages);

    const doc = await this.ensureDocument();
    doc.eyebrow = dto.eyebrow?.trim() || undefined;
    doc.title = dto.title.trim();
    doc.intro = dto.intro.trim();
    doc.contactName = dto.contactName?.trim() || undefined;
    doc.whatsappPhone = dto.whatsappPhone?.trim() || undefined;
    doc.whatsappCtaLabel = dto.whatsappCtaLabel?.trim() || undefined;
    doc.whatsappMessage = dto.whatsappMessage?.trim() || undefined;
    doc.packages = dto.packages.map((item) => ({
      key: item.key,
      name: item.name.trim(),
      tagline: item.tagline?.trim() || undefined,
      philosophy: item.philosophy?.trim() || undefined,
      duration: item.duration?.trim() || undefined,
      extrasIntro: item.extrasIntro?.trim() || undefined,
      facilities: item.facilities.map((line) => line.trim()).filter(Boolean),
      startingPrice: item.startingPrice?.trim() || undefined,
      minPax: item.minPax,
    }));
    doc.comparisonTitle = dto.comparisonTitle?.trim() || undefined;
    doc.comparisonRows = dto.comparisonRows.map((row) => ({
      feature: row.feature.trim(),
      tektok: row.tektok.trim(),
      camp: row.camp.trim(),
    }));
    doc.whyTitle = dto.whyTitle?.trim() || undefined;
    doc.whyItems = dto.whyItems.map((item) => ({
      title: item.title.trim(),
      description: item.description?.trim() || undefined,
    }));
    doc.ctaTitle = dto.ctaTitle?.trim() || undefined;
    doc.ctaDescription = dto.ctaDescription?.trim() || undefined;
    doc.notes = dto.notes.map((note) => note.trim()).filter(Boolean);

    await doc.save();
    return this.toResponse(doc);
  }

  async ensureDocument() {
    const existing = await this.model.findOne({ key: PRIVATE_TRIP_KEY }).exec();
    if (existing) {
      return existing;
    }

    return this.model.create(PRIVATE_TRIP_SEED);
  }

  private assertPackages(packages: UpdatePrivateTripDto['packages']) {
    const keys = packages.map((item) => item.key);
    const missing = TRIP_PACKAGE_KEYS.filter((key) => !keys.includes(key));
    if (missing.length > 0 || new Set(keys).size !== keys.length) {
      throw new BadRequestException(
        'Private trip harus punya dua paket: tektok dan camp',
      );
    }
  }

  private toResponse(doc: PrivateTripDocument): PrivateTripResponseDto {
    return {
      id: doc._id.toString(),
      eyebrow: doc.eyebrow,
      title: doc.title,
      intro: doc.intro,
      contactName: doc.contactName,
      whatsappPhone: doc.whatsappPhone,
      whatsappCtaLabel: doc.whatsappCtaLabel,
      whatsappMessage: doc.whatsappMessage,
      packages: doc.packages ?? [],
      comparisonTitle: doc.comparisonTitle,
      comparisonRows: doc.comparisonRows ?? [],
      whyTitle: doc.whyTitle,
      whyItems: doc.whyItems ?? [],
      ctaTitle: doc.ctaTitle,
      ctaDescription: doc.ctaDescription,
      notes: doc.notes ?? [],
      updatedAt: doc.updatedAt,
    };
  }
}
