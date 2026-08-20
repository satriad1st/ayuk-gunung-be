import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { slugify } from '../../common/utils/slugify';
import { MountainsService } from '../mountains/mountains.service';
import { LocalStorageService } from '../storage/local-storage.service';
import { BasecampResponseDto } from './dto/basecamp-response.dto';
import { CreateBasecampDto } from './dto/create-basecamp.dto';
import { QueryBasecampDto } from './dto/query-basecamp.dto';
import { UpdateBasecampDto } from './dto/update-basecamp.dto';
import {
  Basecamp,
  BasecampDocument,
  BasecampOpenStatus,
  BasecampStatus,
  OpenDaysType,
  SimaksiType,
} from './schemas/basecamp.schema';
import { escapeRegex } from '../../common/utils/escape-regex';

type PopulatedMountain = { _id: Types.ObjectId; name: string; slug?: string };

@Injectable()
export class BasecampsService {
  constructor(
    @InjectModel(Basecamp.name)
    private readonly basecampModel: Model<BasecampDocument>,
    private readonly mountainsService: MountainsService,
    private readonly storageService: LocalStorageService,
  ) {}

  async create(dto: CreateBasecampDto): Promise<BasecampResponseDto> {
    await this.mountainsService.assertExists(dto.mountainId);

    this.assertDurationRange(dto.durationHoursMin, dto.durationHoursMax);
    this.assertRouteSegments(dto.routeSegments);

    const basecamp = await this.basecampModel.create({
      name: dto.name,
      slug: await this.uniqueSlug(dto.name),
      address: dto.address,
      contactName: dto.contactName,
      contactPhone: dto.contactPhone,
      mountain: new Types.ObjectId(dto.mountainId),
      latitude: dto.latitude,
      longitude: dto.longitude,
      images: dto.images ?? [],
      gpxFile: dto.gpxFile,
      gpxFileName: dto.gpxFileName,
      overnightStay: dto.overnightStay,
      simaksiPrice: dto.simaksiPrice,
      ...this.simaksiFields(dto),
      trashCheck: dto.trashCheck,
      status: dto.status,
      ...this.operationalFields(dto),
    });

    return this.findById(basecamp._id.toString());
  }

  async findAll(query: QueryBasecampDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filter: Record<string, unknown> = {};

    if (query.mountainId) {
      filter.mountain = new Types.ObjectId(query.mountainId);
    }

    if (query.overnightStay) {
      filter.overnightStay = query.overnightStay;
    }

    if (query.trashCheck) {
      filter.trashCheck = query.trashCheck;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      const keyword = query.search.trim();
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } },
        { contactName: { $regex: keyword, $options: 'i' } },
        { contactPhone: { $regex: keyword, $options: 'i' } },
      ];
    }

    const [rows, total] = await Promise.all([
      this.basecampModel
        .find(filter)
        .populate('mountain', 'name')
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.basecampModel.countDocuments(filter).exec(),
    ]);

    return {
      data: rows.map((row) => this.toResponse(row)),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id: string): Promise<BasecampResponseDto> {
    return this.toResponse(await this.findDocument(id));
  }

  async findPublicByMountain(mountainId: string) {
    if (!Types.ObjectId.isValid(mountainId)) {
      return [];
    }

    const rows = await this.basecampModel
      .find({
        mountain: new Types.ObjectId(mountainId),
      })
      .populate('mountain', 'name slug')
      .sort({ name: 1 })
      .exec();

    return rows.map((row) => this.toPublicResponse(row));
  }

  async findPublicBySlug(slug: string) {
    const basecamp = await this.basecampModel
      .findOne({ slug })
      .populate('mountain', 'name slug')
      .exec();

    if (!basecamp) {
      throw new NotFoundException('Basecamp not found');
    }

    return this.toPublicResponse(basecamp);
  }

  async searchPublic(keyword: string, limit = 6) {
    const safe = escapeRegex(keyword);
    if (!safe) {
      return [];
    }

    const rows = await this.basecampModel
      .find({
        name: { $regex: safe, $options: 'i' },
      })
      .populate('mountain', 'name slug')
      .sort({ name: 1 })
      .limit(limit)
      .exec();

    return rows.map((row) => this.toPublicResponse(row));
  }

  async update(
    id: string,
    dto: UpdateBasecampDto,
  ): Promise<BasecampResponseDto> {
    const basecamp = await this.findDocument(id);

    if (dto.mountainId) {
      await this.mountainsService.assertExists(dto.mountainId);
      basecamp.mountain = new Types.ObjectId(dto.mountainId);
    }

    if (dto.name && dto.name !== basecamp.name) {
      basecamp.slug = await this.uniqueSlug(dto.name, id);
      basecamp.name = dto.name;
    }

    if (dto.address !== undefined) {
      basecamp.address = dto.address;
    }

    if (dto.contactName !== undefined) {
      basecamp.contactName = dto.contactName;
    }

    if (dto.contactPhone !== undefined) {
      basecamp.contactPhone = dto.contactPhone;
    }

    if (dto.latitude !== undefined) {
      basecamp.latitude = dto.latitude;
    }

    if (dto.longitude !== undefined) {
      basecamp.longitude = dto.longitude;
    }

    if (dto.overnightStay) {
      basecamp.overnightStay = dto.overnightStay;
    }

    if (dto.trashCheck) {
      basecamp.trashCheck = dto.trashCheck;
    }

    if (dto.status) {
      basecamp.status = dto.status;
    }

    this.assertDurationRange(
      dto.durationHoursMin ?? basecamp.durationHoursMin,
      dto.durationHoursMax ?? basecamp.durationHoursMax,
    );

    if (dto.openStatus) {
      basecamp.openStatus = dto.openStatus;
    }

    if (dto.openDaysType) {
      basecamp.openDaysType = dto.openDaysType;
      if (dto.openDaysType === OpenDaysType.EVERYDAY) {
        basecamp.openDays = [];
      }
    }

    if (dto.openDays !== undefined) {
      basecamp.openDays =
        (dto.openDaysType ?? basecamp.openDaysType) === OpenDaysType.CUSTOM
          ? dto.openDays
          : [];
    }

    if (dto.openTimeFrom !== undefined) {
      basecamp.openTimeFrom = dto.openTimeFrom || undefined;
    }

    if (dto.openTimeTo !== undefined) {
      basecamp.openTimeTo = dto.openTimeTo || undefined;
    }

    if (dto.tektokAllowed !== undefined) {
      basecamp.tektokAllowed = dto.tektokAllowed;
      if (!dto.tektokAllowed) {
        basecamp.tektokDeadline = undefined;
      }
    }

    if (dto.tektokDeadline !== undefined) {
      basecamp.tektokDeadline = dto.tektokAllowed === false
        ? undefined
        : dto.tektokDeadline || undefined;
    }

    if (dto.elevationGain !== undefined) {
      basecamp.elevationGain = dto.elevationGain ?? undefined;
    }

    if (dto.distanceKm !== undefined) {
      basecamp.distanceKm = dto.distanceKm ?? undefined;
    }

    if (dto.durationHoursMin !== undefined) {
      basecamp.durationHoursMin = dto.durationHoursMin ?? undefined;
    }

    if (dto.durationHoursMax !== undefined) {
      basecamp.durationHoursMax = dto.durationHoursMax ?? undefined;
    }

    if (dto.routeSegments !== undefined) {
      this.assertRouteSegments(dto.routeSegments);
      basecamp.routeSegments = this.normalizeRouteSegments(dto.routeSegments);
    }

    if (dto.simaksiPrice !== undefined) {
      basecamp.simaksiPrice = dto.simaksiPrice;
    }

    if (
      dto.simaksiType !== undefined ||
      dto.simaksiRegistrationUrl !== undefined
    ) {
      const nextType = dto.simaksiType ?? basecamp.simaksiType ?? SimaksiType.ON_SITE;
      const nextUrl =
        dto.simaksiRegistrationUrl !== undefined
          ? dto.simaksiRegistrationUrl
          : basecamp.simaksiRegistrationUrl;
      const fields = this.simaksiFields({
        simaksiType: nextType,
        simaksiRegistrationUrl: nextUrl,
      });
      basecamp.simaksiType = fields.simaksiType;
      basecamp.simaksiRegistrationUrl = fields.simaksiRegistrationUrl;
      if (!fields.simaksiRegistrationUrl) {
        basecamp.set('simaksiRegistrationUrl', undefined);
      }
    }

    if (dto.images) {
      const removed = basecamp.images.filter(
        (image) => !dto.images?.includes(image),
      );
      await Promise.all(
        removed.map((image) => this.storageService.remove(image)),
      );
      basecamp.images = dto.images;
    }

    if (dto.gpxFile !== undefined) {
      if (basecamp.gpxFile && basecamp.gpxFile !== dto.gpxFile) {
        await this.storageService.remove(basecamp.gpxFile);
      }
      basecamp.gpxFile = dto.gpxFile || undefined;
      basecamp.gpxFileName = dto.gpxFile ? dto.gpxFileName : undefined;
    } else if (dto.gpxFileName !== undefined) {
      basecamp.gpxFileName = dto.gpxFileName;
    }

    await basecamp.save();
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const basecamp = await this.findDocument(id);
    await Promise.all([
      ...basecamp.images.map((image) => this.storageService.remove(image)),
      basecamp.gpxFile
        ? this.storageService.remove(basecamp.gpxFile)
        : Promise.resolve(),
    ]);
    await basecamp.deleteOne();
  }

  private async findDocument(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Basecamp not found');
    }

    const basecamp = await this.basecampModel
      .findById(id)
      .populate('mountain', 'name')
      .exec();

    if (!basecamp) {
      throw new NotFoundException('Basecamp not found');
    }

    return basecamp;
  }

  private async uniqueSlug(name: string, excludeId?: string) {
    const base = slugify(name);
    let slug = base;
    let suffix = 2;

    while (await this.slugTaken(slug, excludeId)) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  private async slugTaken(slug: string, excludeId?: string) {
    const existing = await this.basecampModel.findOne({ slug }).exec();
    if (!existing) {
      return false;
    }

    return existing._id.toString() !== excludeId;
  }

  private toResponse(basecamp: BasecampDocument): BasecampResponseDto {
    const mountain = basecamp.mountain as unknown as PopulatedMountain;

    if (!mountain?.name) {
      throw new ConflictException('Basecamp mountain data is incomplete');
    }

    return {
      id: basecamp._id.toString(),
      name: basecamp.name,
      slug: basecamp.slug,
      address: basecamp.address,
      contactName: basecamp.contactName ?? '',
      contactPhone: basecamp.contactPhone ?? '',
      mountain: {
        id: mountain._id.toString(),
        name: mountain.name,
      },
      latitude: basecamp.latitude,
      longitude: basecamp.longitude,
      mapsUrl: `https://www.google.com/maps?q=${basecamp.latitude},${basecamp.longitude}`,
      images: basecamp.images,
      gpxFile: basecamp.gpxFile,
      gpxFileName: basecamp.gpxFileName,
      overnightStay: basecamp.overnightStay,
      simaksiPrice: basecamp.simaksiPrice,
      simaksiType: basecamp.simaksiType ?? SimaksiType.ON_SITE,
      simaksiRegistrationUrl: basecamp.simaksiRegistrationUrl,
      trashCheck: basecamp.trashCheck,
      status: basecamp.status,
      openStatus: basecamp.openStatus ?? BasecampOpenStatus.OPEN,
      openDaysType: basecamp.openDaysType ?? OpenDaysType.EVERYDAY,
      openDays: basecamp.openDays ?? [],
      openTimeFrom: basecamp.openTimeFrom,
      openTimeTo: basecamp.openTimeTo,
      tektokAllowed: basecamp.tektokAllowed ?? false,
      tektokDeadline: basecamp.tektokDeadline,
      elevationGain: basecamp.elevationGain,
      distanceKm: basecamp.distanceKm,
      durationHoursMin: basecamp.durationHoursMin,
      durationHoursMax: basecamp.durationHoursMax,
      routeSegments: this.normalizeRouteSegments(basecamp.routeSegments),
      createdAt: basecamp.createdAt,
      updatedAt: basecamp.updatedAt,
    };
  }

  private simaksiFields(dto: {
    simaksiType?: SimaksiType;
    simaksiRegistrationUrl?: string | null;
  }) {
    const simaksiType = dto.simaksiType ?? SimaksiType.ON_SITE;
    const url =
      typeof dto.simaksiRegistrationUrl === 'string'
        ? dto.simaksiRegistrationUrl.trim()
        : undefined;

    if (simaksiType === SimaksiType.ONLINE && !url) {
      throw new BadRequestException(
        'Link registrasi simaksi wajib diisi jika jenis simaksi online',
      );
    }

    return {
      simaksiType,
      simaksiRegistrationUrl:
        simaksiType === SimaksiType.ONLINE ? url : undefined,
    };
  }

  private operationalFields(dto: CreateBasecampDto | UpdateBasecampDto) {
    const openDaysType = dto.openDaysType ?? OpenDaysType.EVERYDAY;
    return {
      openStatus: dto.openStatus ?? BasecampOpenStatus.OPEN,
      openDaysType,
      openDays:
        openDaysType === OpenDaysType.CUSTOM ? (dto.openDays ?? []) : [],
      openTimeFrom: dto.openTimeFrom || undefined,
      openTimeTo: dto.openTimeTo || undefined,
      tektokAllowed: dto.tektokAllowed ?? false,
      tektokDeadline: dto.tektokAllowed
        ? dto.tektokDeadline || undefined
        : undefined,
      elevationGain: dto.elevationGain ?? undefined,
      distanceKm: dto.distanceKm ?? undefined,
      durationHoursMin: dto.durationHoursMin ?? undefined,
      durationHoursMax: dto.durationHoursMax ?? undefined,
      routeSegments: this.normalizeRouteSegments(dto.routeSegments),
    };
  }

  private assertDurationRange(min?: number | null, max?: number | null) {
    if (min != null && max != null && max < min) {
      throw new BadRequestException(
        'durationHoursMax must be greater than or equal to durationHoursMin',
      );
    }
  }

  private assertRouteSegments(
    segments?: Array<{
      durationMinutesMin?: number | null;
      durationMinutesMax?: number | null;
    }>,
  ) {
    for (const segment of segments ?? []) {
      if (
        segment.durationMinutesMin != null &&
        segment.durationMinutesMax != null &&
        segment.durationMinutesMax < segment.durationMinutesMin
      ) {
        throw new BadRequestException(
          'Segment duration max must be greater than or equal to duration min',
        );
      }
    }
  }

  private normalizeRouteSegments(
    segments?: Array<{
      fromName: string;
      toName: string;
      elevationGain?: number | null;
      distanceKm?: number | null;
      durationMinutesMin?: number | null;
      durationMinutesMax?: number | null;
    }>,
  ) {
    return (segments ?? []).map((segment) => ({
      fromName: segment.fromName,
      toName: segment.toName,
      elevationGain: segment.elevationGain ?? undefined,
      distanceKm: segment.distanceKm ?? undefined,
      durationMinutesMin: segment.durationMinutesMin ?? undefined,
      durationMinutesMax: segment.durationMinutesMax ?? undefined,
    }));
  }

  toPublicResponse(basecamp: BasecampDocument) {
    const mountain = basecamp.mountain as unknown as PopulatedMountain;
    const response = this.toResponse(basecamp);
    const { status: _status, createdAt: _c, updatedAt: _u, ...rest } =
      response;
    return {
      ...rest,
      mountain: {
        ...response.mountain,
        slug: mountain.slug ?? '',
      },
    };
  }
}
