import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdminRole } from '../../common/constants/admin-roles';
import { AdminAuthUser } from '../../common/interfaces/auth-admin.interface';
import { slugify } from '../../common/utils/slugify';
import { MountainsService } from '../mountains/mountains.service';
import { RegionsService } from '../regions/regions.service';
import { LocalStorageService } from '../storage/local-storage.service';
import { CreateHomestayDto } from './dto/create-homestay.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import {
  HomestayResponseDto,
  NamedSummaryDto,
  RoomResponseDto,
} from './dto/homestay-response.dto';
import { QueryHomestayDto } from './dto/query-homestay.dto';
import { UpdateHomestayDto } from './dto/update-homestay.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Facility } from './schemas/facility.schema';
import {
  Homestay,
  HomestayDocument,
  HomestayStatus,
  RentalType,
} from './schemas/homestay.schema';
import { escapeRegex } from '../../common/utils/escape-regex';
import { PriceType, Room, RoomDocument } from './schemas/room.schema';

type NamedDoc = { _id: Types.ObjectId; name: string; slug?: string };

@Injectable()
export class HomestaysService {
  constructor(
    @InjectModel(Homestay.name)
    private readonly homestayModel: Model<HomestayDocument>,
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>,
    private readonly regionsService: RegionsService,
    private readonly mountainsService: MountainsService,
    private readonly storageService: LocalStorageService,
  ) {}

  async findFacilities() {
    const rows = await this.facilityModel.find().sort({ name: 1 }).exec();
    return rows.map((row) => ({
      id: row._id.toString(),
      name: row.name,
      slug: row.slug,
    }));
  }

  async create(
    dto: CreateHomestayDto,
    actor: AdminAuthUser,
  ): Promise<HomestayResponseDto> {
    await this.regionsService.getProvince(dto.provinceId);
    await this.regionsService.getCityInProvince(dto.cityId, dto.provinceId);
    await this.mountainsService.assertAllExist(dto.mountainIds);
    await this.assertFacilitiesExist(dto.facilityIds ?? []);

    const homestay = await this.homestayModel.create({
      name: dto.name,
      slug: await this.uniqueSlug(dto.name),
      address: dto.address,
      contactName: dto.contactName,
      contactPhone: dto.contactPhone,
      rentalType: dto.rentalType,
      province: new Types.ObjectId(dto.provinceId),
      city: new Types.ObjectId(dto.cityId),
      latitude: dto.latitude,
      longitude: dto.longitude,
      mountains: dto.mountainIds.map((id) => new Types.ObjectId(id)),
      facilities: (dto.facilityIds ?? []).map((id) => new Types.ObjectId(id)),
      images: dto.images ?? [],
      owner: new Types.ObjectId(actor.id),
      status: dto.status,
    });

    return this.findById(homestay._id.toString(), actor);
  }

  async findAll(query: QueryHomestayDto, actor: AdminAuthUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filter: Record<string, unknown> = {
      ...this.ownerFilter(actor),
    };

    if (query.provinceId) {
      filter.province = new Types.ObjectId(query.provinceId);
    }
    if (query.cityId) {
      filter.city = new Types.ObjectId(query.cityId);
    }
    if (query.mountainId) {
      filter.mountains = new Types.ObjectId(query.mountainId);
    }
    if (query.status) {
      filter.status = query.status;
    }
    if (query.rentalType) {
      filter.rentalType = query.rentalType;
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
      this.homestayModel
        .find(filter)
        .populate('province', 'name')
        .populate('city', 'name')
        .populate('mountains', 'name')
        .populate('facilities', 'name')
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.homestayModel.countDocuments(filter).exec(),
    ]);

    const roomCounts = await this.roomCounts(rows.map((row) => row._id));

    return {
      data: rows.map((row) =>
        this.toHomestayResponse(row, roomCounts.get(row._id.toString()) ?? 0),
      ),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(
    id: string,
    actor: AdminAuthUser,
  ): Promise<HomestayResponseDto> {
    const homestay = await this.findHomestay(id, actor);
    const counts = await this.roomCounts([homestay._id]);
    return this.toHomestayResponse(
      homestay,
      counts.get(homestay._id.toString()) ?? 0,
    );
  }

  async update(
    id: string,
    dto: UpdateHomestayDto,
    actor: AdminAuthUser,
  ): Promise<HomestayResponseDto> {
    const homestay = await this.findHomestay(id, actor);
    const provinceId = dto.provinceId ?? this.refId(homestay.province);
    const cityId = dto.cityId ?? this.refId(homestay.city);

    if (dto.provinceId || dto.cityId) {
      await this.regionsService.getProvince(provinceId);
      await this.regionsService.getCityInProvince(cityId, provinceId);
    }

    if (dto.mountainIds) {
      await this.mountainsService.assertAllExist(dto.mountainIds);
      homestay.mountains = dto.mountainIds.map(
        (mountainId) => new Types.ObjectId(mountainId),
      );
    }

    if (dto.facilityIds) {
      await this.assertFacilitiesExist(dto.facilityIds);
      homestay.facilities = dto.facilityIds.map(
        (facilityId) => new Types.ObjectId(facilityId),
      );
    }

    if (dto.name && dto.name !== homestay.name) {
      homestay.slug = await this.uniqueSlug(dto.name, id);
      homestay.name = dto.name;
    }
    if (dto.address !== undefined) {
      homestay.address = dto.address;
    }
    if (dto.contactName !== undefined) {
      homestay.contactName = dto.contactName;
    }
    if (dto.contactPhone !== undefined) {
      homestay.contactPhone = dto.contactPhone;
    }
    if (dto.rentalType) {
      homestay.rentalType = dto.rentalType;
    }
    if (dto.provinceId) {
      homestay.province = new Types.ObjectId(dto.provinceId);
    }
    if (dto.cityId) {
      homestay.city = new Types.ObjectId(dto.cityId);
    }
    if (dto.latitude !== undefined) {
      homestay.latitude = dto.latitude;
    }
    if (dto.longitude !== undefined) {
      homestay.longitude = dto.longitude;
    }
    if (dto.status) {
      homestay.status = dto.status;
    }
    if (dto.images) {
      const removed = homestay.images.filter(
        (image) => !dto.images?.includes(image),
      );
      await Promise.all(
        removed.map((image) => this.storageService.remove(image)),
      );
      homestay.images = dto.images;
    }

    await homestay.save();
    return this.findById(id, actor);
  }

  async remove(id: string, actor: AdminAuthUser): Promise<void> {
    const homestay = await this.findHomestay(id, actor);
    const rooms = await this.roomModel.find({ homestay: homestay._id }).exec();
    const files = [...homestay.images, ...rooms.flatMap((room) => room.images)];
    await Promise.all(files.map((file) => this.storageService.remove(file)));
    await this.roomModel.deleteMany({ homestay: homestay._id }).exec();
    await homestay.deleteOne();
  }

  async createRoom(
    homestayId: string,
    dto: CreateRoomDto,
    actor: AdminAuthUser,
  ): Promise<RoomResponseDto> {
    const homestay = await this.findHomestay(homestayId, actor);
    this.assertRoomPrice(dto.priceType, dto.price, dto.priceMax);

    const room = await this.roomModel.create({
      homestay: homestay._id,
      name: dto.name,
      type: dto.type,
      priceType: dto.priceType,
      price: dto.price,
      priceMax: dto.priceType === PriceType.RANGE ? dto.priceMax : undefined,
      images: dto.images ?? [],
    });

    return this.toRoomResponse(room);
  }

  async findRooms(homestayId: string, actor: AdminAuthUser) {
    const homestay = await this.findHomestay(homestayId, actor);
    const rooms = await this.roomModel
      .find({ homestay: homestay._id })
      .sort({ name: 1 })
      .exec();
    return rooms.map((room) => this.toRoomResponse(room));
  }

  async findPublicByMountain(mountainId: string) {
    if (!Types.ObjectId.isValid(mountainId)) {
      return [];
    }

    const rows = await this.homestayModel
      .find({
        mountains: new Types.ObjectId(mountainId),
        status: HomestayStatus.ACTIVE,
      })
      .populate('province', 'name')
      .populate('city', 'name')
      .populate('mountains', 'name slug')
      .populate('facilities', 'name')
      .sort({ name: 1 })
      .exec();

    const counts = await this.roomCounts(rows.map((row) => row._id));
    return rows.map((row) =>
      this.toPublicResponse(row, counts.get(row._id.toString()) ?? 0),
    );
  }

  async findPublicBySlug(slug: string) {
    const homestay = await this.homestayModel
      .findOne({ slug, status: HomestayStatus.ACTIVE })
      .populate('province', 'name')
      .populate('city', 'name')
      .populate('mountains', 'name slug')
      .populate('facilities', 'name')
      .exec();

    if (!homestay) {
      throw new NotFoundException('Homestay not found');
    }

    const counts = await this.roomCounts([homestay._id]);
    const rooms = await this.roomModel
      .find({ homestay: homestay._id })
      .sort({ name: 1 })
      .exec();

    return {
      ...this.toPublicResponse(
        homestay,
        counts.get(homestay._id.toString()) ?? 0,
      ),
      rooms: rooms.map((room) => this.toRoomResponse(room)),
    };
  }

  async searchPublic(keyword: string, limit = 6) {
    const safe = escapeRegex(keyword);
    if (!safe) {
      return [];
    }

    const rows = await this.homestayModel
      .find({
        status: HomestayStatus.ACTIVE,
        name: { $regex: safe, $options: 'i' },
      })
      .populate('province', 'name')
      .populate('city', 'name')
      .populate('mountains', 'name slug')
      .populate('facilities', 'name')
      .sort({ name: 1 })
      .limit(limit)
      .exec();

    const counts = await this.roomCounts(rows.map((row) => row._id));
    return rows.map((row) =>
      this.toPublicResponse(row, counts.get(row._id.toString()) ?? 0),
    );
  }

  async updateRoom(
    homestayId: string,
    roomId: string,
    dto: UpdateRoomDto,
    actor: AdminAuthUser,
  ): Promise<RoomResponseDto> {
    await this.findHomestay(homestayId, actor);
    const room = await this.findRoom(homestayId, roomId);
    const priceType = dto.priceType ?? room.priceType;
    const price = dto.price ?? room.price;
    const priceMax = dto.priceMax !== undefined ? dto.priceMax : room.priceMax;
    this.assertRoomPrice(priceType, price, priceMax);

    if (dto.name) {
      room.name = dto.name;
    }
    if (dto.type) {
      room.type = dto.type;
    }
    room.priceType = priceType;
    room.price = price;
    room.priceMax = priceType === PriceType.RANGE ? priceMax : undefined;

    if (dto.images) {
      const removed = room.images.filter(
        (image) => !dto.images?.includes(image),
      );
      await Promise.all(
        removed.map((image) => this.storageService.remove(image)),
      );
      room.images = dto.images;
    }

    await room.save();
    return this.toRoomResponse(room);
  }

  async removeRoom(homestayId: string, roomId: string, actor: AdminAuthUser) {
    await this.findHomestay(homestayId, actor);
    const room = await this.findRoom(homestayId, roomId);
    await Promise.all(
      room.images.map((image) => this.storageService.remove(image)),
    );
    await room.deleteOne();
  }

  private ownerFilter(actor: AdminAuthUser) {
    if (actor.role === AdminRole.ADMIN_HOMESTAY) {
      return { owner: new Types.ObjectId(actor.id) };
    }
    return {};
  }

  private async findHomestay(id: string, actor: AdminAuthUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Homestay not found');
    }

    const homestay = await this.homestayModel
      .findOne({ _id: new Types.ObjectId(id), ...this.ownerFilter(actor) })
      .populate('province', 'name')
      .populate('city', 'name')
      .populate('mountains', 'name')
      .populate('facilities', 'name')
      .exec();

    if (!homestay) {
      throw new NotFoundException('Homestay not found');
    }

    if (
      actor.role === AdminRole.ADMIN_HOMESTAY &&
      homestay.owner.toString() !== actor.id
    ) {
      throw new ForbiddenException('You can only manage your own homestays');
    }

    return homestay;
  }

  private async findRoom(homestayId: string, roomId: string) {
    if (!Types.ObjectId.isValid(roomId)) {
      throw new NotFoundException('Room not found');
    }

    const room = await this.roomModel
      .findOne({
        _id: roomId,
        homestay: new Types.ObjectId(homestayId),
      })
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  private async assertFacilitiesExist(ids: string[]) {
    if (ids.length === 0) {
      return;
    }

    const unique = [...new Set(ids)];
    if (unique.some((id) => !Types.ObjectId.isValid(id))) {
      throw new NotFoundException('One or more facilities were not found');
    }

    const count = await this.facilityModel.countDocuments({
      _id: { $in: unique.map((id) => new Types.ObjectId(id)) },
    });

    if (count !== unique.length) {
      throw new NotFoundException('One or more facilities were not found');
    }
  }

  private assertRoomPrice(
    priceType: PriceType,
    price: number,
    priceMax?: number,
  ) {
    if (priceType === PriceType.RANGE) {
      if (priceMax == null) {
        throw new BadRequestException(
          'priceMax is required when price type is range',
        );
      }
      if (priceMax < price) {
        throw new BadRequestException(
          'priceMax must be greater than or equal to price',
        );
      }
    }
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
    const existing = await this.homestayModel.findOne({ slug }).exec();
    return Boolean(existing) && existing!._id.toString() !== excludeId;
  }

  private async roomCounts(ids: Types.ObjectId[]) {
    if (ids.length === 0) {
      return new Map<string, number>();
    }

    const rows = await this.roomModel
      .aggregate<{ _id: Types.ObjectId; count: number }>([
        { $match: { homestay: { $in: ids } } },
        { $group: { _id: '$homestay', count: { $sum: 1 } } },
      ])
      .exec();

    return new Map(rows.map((row) => [row._id.toString(), row.count]));
  }

  private toNamed(value: NamedDoc): NamedSummaryDto {
    return { id: value._id.toString(), name: value.name };
  }

  private toPublicResponse(homestay: HomestayDocument, roomCount: number) {
    const full = this.toHomestayResponse(homestay, roomCount);
    const mountains = (homestay.mountains as unknown as NamedDoc[]) ?? [];
    return {
      id: full.id,
      name: full.name,
      slug: full.slug,
      address: full.address,
      contactName: full.contactName,
      contactPhone: full.contactPhone,
      rentalType: full.rentalType,
      province: full.province,
      city: full.city,
      latitude: full.latitude,
      longitude: full.longitude,
      mapsUrl: full.mapsUrl,
      facilities: full.facilities,
      images: full.images,
      roomCount: full.roomCount,
      mountains: mountains.map((item) => ({
        id: item._id.toString(),
        name: item.name,
        slug: item.slug ?? '',
      })),
    };
  }

  private refId(value: unknown) {
    const record = value as {
      _id?: { toString(): string };
      toString(): string;
    };
    return record._id ? record._id.toString() : record.toString();
  }

  private toHomestayResponse(
    homestay: HomestayDocument,
    roomCount: number,
  ): HomestayResponseDto {
    const province = homestay.province as unknown as NamedDoc;
    const city = homestay.city as unknown as NamedDoc;
    const mountains = (homestay.mountains as unknown as NamedDoc[]) ?? [];
    const facilities = (homestay.facilities as unknown as NamedDoc[]) ?? [];

    return {
      id: homestay._id.toString(),
      name: homestay.name,
      slug: homestay.slug,
      address: homestay.address,
      contactName: homestay.contactName ?? '',
      contactPhone: homestay.contactPhone ?? '',
      rentalType: homestay.rentalType ?? RentalType.ROOM,
      province: this.toNamed(province),
      city: this.toNamed(city),
      latitude: homestay.latitude,
      longitude: homestay.longitude,
      mapsUrl: `https://www.google.com/maps?q=${homestay.latitude},${homestay.longitude}`,
      mountains: mountains.map((item) => this.toNamed(item)),
      facilities: facilities.map((item) => this.toNamed(item)),
      images: homestay.images,
      roomCount,
      ownerId: homestay.owner.toString(),
      status: homestay.status,
      createdAt: homestay.createdAt,
      updatedAt: homestay.updatedAt,
    };
  }

  private toRoomResponse(room: RoomDocument): RoomResponseDto {
    return {
      id: room._id.toString(),
      homestayId: room.homestay.toString(),
      name: room.name,
      type: room.type,
      priceType: room.priceType,
      price: room.price,
      priceMax: room.priceMax,
      priceLabel: this.priceLabel(room.priceType, room.price, room.priceMax),
      images: room.images,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }

  private priceLabel(type: PriceType, price: number, priceMax?: number) {
    const format = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

    if (type === PriceType.RANGE && priceMax != null) {
      return `${format(price)} - ${format(priceMax)}`;
    }

    return format(price);
  }
}
