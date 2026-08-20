import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { slugify } from '../../common/utils/slugify';
import { objectIdFilter, toObjectId } from '../../common/utils/object-id';
import { RegionsService } from '../regions/regions.service';
import { LocalStorageService } from '../storage/local-storage.service';
import { CreateMountainDto } from './dto/create-mountain.dto';
import { MountainResponseDto } from './dto/mountain-response.dto';
import { QueryMountainDto } from './dto/query-mountain.dto';
import { UpdateMountainDto } from './dto/update-mountain.dto';
import { escapeRegex } from '../../common/utils/escape-regex';
import {
  Mountain,
  MountainDocument,
  MountainType,
  HikingStatus,
  PUBLIC_MOUNTAIN_STATUSES,
} from './schemas/mountain.schema';

type PopulatedRegion = { _id: Types.ObjectId; name: string };

@Injectable()
export class MountainsService {
  constructor(
    @InjectModel(Mountain.name)
    private readonly mountainModel: Model<MountainDocument>,
    private readonly regionsService: RegionsService,
    private readonly storageService: LocalStorageService,
  ) {}

  async create(dto: CreateMountainDto): Promise<MountainResponseDto> {
    await this.regionsService.getProvince(dto.provinceId);
    await this.regionsService.getCityInProvince(dto.cityId, dto.provinceId);

    const mountain = await this.mountainModel.create({
      name: dto.name,
      slug: await this.uniqueSlug(dto.name),
      description: dto.description ?? '',
      elevation: dto.elevation,
      province: toObjectId(dto.provinceId),
      city: toObjectId(dto.cityId),
      latitude: dto.latitude,
      longitude: dto.longitude,
      images: dto.images ?? [],
      type: dto.type ?? MountainType.NON_VOLCANO,
      status: dto.status,
      hikingStatus: dto.hikingStatus ?? HikingStatus.OPEN,
    });

    return this.findById(mountain._id.toString());
  }

  async findAll(query: QueryMountainDto, options?: { publicOnly?: boolean }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filter: Record<string, unknown> = {};

    if (query.provinceId) {
      filter.province = objectIdFilter(query.provinceId);
    }

    if (query.cityId) {
      filter.city = objectIdFilter(query.cityId);
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (options?.publicOnly) {
      filter.status = { $in: [...PUBLIC_MOUNTAIN_STATUSES] };
    } else if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      const keyword = query.search.trim();
      filter.name = { $regex: keyword, $options: 'i' };
    }

    const [rows, total] = await Promise.all([
      this.mountainModel
        .find(filter)
        .populate('province', 'name')
        .populate('city', 'name')
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.mountainModel.countDocuments(filter).exec(),
    ]);

    return {
      data: rows.map((row) => this.toResponse(row)),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id: string): Promise<MountainResponseDto> {
    const mountain = await this.findDocument(id);
    return this.toResponse(mountain);
  }

  async findPublic(query: QueryMountainDto) {
    const result = await this.findAll(
      {
        ...query,
        search: query.search ? escapeRegex(query.search) : undefined,
        status: undefined,
      },
      { publicOnly: true },
    );

    return {
      ...result,
      data: result.data.map((item) => this.toPublicResponse(item)),
    };
  }

  async findPublicBySlug(slug: string) {
    const mountain = await this.mountainModel
      .findOne({
        slug,
        status: { $in: [...PUBLIC_MOUNTAIN_STATUSES] },
      })
      .populate('province', 'name')
      .populate('city', 'name')
      .exec();

    if (!mountain) {
      throw new NotFoundException('Mountain not found');
    }

    return this.toPublicResponse(this.toResponse(mountain));
  }

  async findPublicProvinces() {
    const rows = await this.mountainModel
      .find({ status: { $in: [...PUBLIC_MOUNTAIN_STATUSES] } })
      .populate('province', 'name')
      .select('province')
      .exec();

    const unique = new Map<string, string>();
    for (const row of rows) {
      const province = row.province as unknown as PopulatedRegion;
      if (province?._id && province.name) {
        unique.set(province._id.toString(), province.name);
      }
    }

    return [...unique.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'id'));
  }

  async searchPublic(keyword: string, limit = 6) {
    const safe = escapeRegex(keyword);
    if (!safe) {
      return [];
    }

    const rows = await this.mountainModel
      .find({
        status: { $in: [...PUBLIC_MOUNTAIN_STATUSES] },
        name: { $regex: safe, $options: 'i' },
      })
      .populate('province', 'name')
      .populate('city', 'name')
      .sort({ name: 1 })
      .limit(limit)
      .exec();

    return rows.map((row) => this.toPublicResponse(this.toResponse(row)));
  }

  async findOptions() {
    const rows = await this.mountainModel
      .find({ status: { $in: [...PUBLIC_MOUNTAIN_STATUSES] } })
      .select('name')
      .sort({ name: 1 })
      .exec();

    return rows.map((row) => ({
      id: row._id.toString(),
      name: row.name,
    }));
  }

  async assertExists(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Mountain not found');
    }

    const exists = await this.mountainModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException('Mountain not found');
    }
  }

  async assertAllExist(ids: string[]) {
    const unique = [...new Set(ids)];
    if (unique.some((id) => !Types.ObjectId.isValid(id))) {
      throw new NotFoundException('One or more mountains were not found');
    }

    const count = await this.mountainModel.countDocuments({
      _id: { $in: unique.map((id) => new Types.ObjectId(id)) },
    });

    if (count !== unique.length) {
      throw new NotFoundException('One or more mountains were not found');
    }
  }

  async update(
    id: string,
    dto: UpdateMountainDto,
  ): Promise<MountainResponseDto> {
    const mountain = await this.findDocument(id);
    const provinceId = dto.provinceId ?? mountain.province.toString();
    const cityId = dto.cityId ?? mountain.city.toString();

    if (dto.provinceId || dto.cityId) {
      await this.regionsService.getProvince(provinceId);
      await this.regionsService.getCityInProvince(cityId, provinceId);
    }

    if (dto.name && dto.name !== mountain.name) {
      mountain.slug = await this.uniqueSlug(dto.name, id);
      mountain.name = dto.name;
    }

    if (dto.description !== undefined) {
      mountain.description = dto.description;
    }

    if (dto.elevation !== undefined) {
      mountain.elevation = dto.elevation;
    }

    if (dto.provinceId) {
      mountain.province = toObjectId(dto.provinceId);
    }

    if (dto.cityId) {
      mountain.city = toObjectId(dto.cityId);
    }

    if (dto.latitude !== undefined) {
      mountain.latitude = dto.latitude;
    }

    if (dto.longitude !== undefined) {
      mountain.longitude = dto.longitude;
    }

    if (dto.type) {
      mountain.type = dto.type;
    }

    if (dto.status) {
      mountain.status = dto.status;
    }

    if (dto.hikingStatus) {
      mountain.hikingStatus = dto.hikingStatus;
    }

    if (dto.images) {
      const removed = mountain.images.filter(
        (image) => !dto.images?.includes(image),
      );
      await Promise.all(
        removed.map((image) => this.storageService.remove(image)),
      );
      mountain.images = dto.images;
    }

    await mountain.save();
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const mountain = await this.findDocument(id);
    await Promise.all(
      mountain.images.map((image) => this.storageService.remove(image)),
    );
    await mountain.deleteOne();
  }

  private async findDocument(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Mountain not found');
    }

    const mountain = await this.mountainModel
      .findById(id)
      .populate('province', 'name')
      .populate('city', 'name')
      .exec();

    if (!mountain) {
      throw new NotFoundException('Mountain not found');
    }

    return mountain;
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
    const existing = await this.mountainModel.findOne({ slug }).exec();
    if (!existing) {
      return false;
    }

    return existing._id.toString() !== excludeId;
  }

  private toResponse(mountain: MountainDocument): MountainResponseDto {
    const province = mountain.province as unknown as PopulatedRegion;
    const city = mountain.city as unknown as PopulatedRegion;

    if (!province?.name || !city?.name) {
      throw new ConflictException('Mountain region data is incomplete');
    }

    return {
      id: mountain._id.toString(),
      name: mountain.name,
      slug: mountain.slug,
      description: mountain.description,
      elevation: mountain.elevation,
      province: {
        id: province._id.toString(),
        name: province.name,
      },
      city: {
        id: city._id.toString(),
        name: city.name,
      },
      latitude: mountain.latitude,
      longitude: mountain.longitude,
      mapsUrl: `https://www.google.com/maps?q=${mountain.latitude},${mountain.longitude}`,
      images: mountain.images,
      type: mountain.type ?? MountainType.NON_VOLCANO,
      status: mountain.status,
      hikingStatus: mountain.hikingStatus ?? HikingStatus.OPEN,
      createdAt: mountain.createdAt,
      updatedAt: mountain.updatedAt,
    };
  }

  private toPublicResponse(mountain: MountainResponseDto) {
    const { createdAt: _c, updatedAt: _u, ...rest } = mountain;
    return rest;
  }
}
