import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { escapeRegex } from '../../common/utils/escape-regex';
import { toObjectId } from '../../common/utils/object-id';
import { slugify } from '../../common/utils/slugify';
import { MountainsService } from '../mountains/mountains.service';
import { CreateOpenTripDto } from './dto/create-open-trip.dto';
import { OpenTripResponseDto } from './dto/open-trip-response.dto';
import { QueryOpenTripDto } from './dto/query-open-trip.dto';
import { UpdateOpenTripDto } from './dto/update-open-trip.dto';
import { normalizeMeetingPoints } from './open-trip.helpers';
import {
  OCCUPYING_BOOKING_STATUSES,
  OpenTripBooking,
  OpenTripBookingDocument,
} from './schemas/open-trip-booking.schema';
import {
  OpenTrip,
  OpenTripDocument,
  OpenTripStatus,
} from './schemas/open-trip.schema';

@Injectable()
export class OpenTripService {
  constructor(
    @InjectModel(OpenTrip.name)
    private readonly tripModel: Model<OpenTripDocument>,
    @InjectModel(OpenTripBooking.name)
    private readonly bookingModel: Model<OpenTripBookingDocument>,
    private readonly mountainsService: MountainsService,
  ) {}

  async create(dto: CreateOpenTripDto) {
    this.assertDates(dto.startDate, dto.endDate);
    const mountain = await this.mountainsService.findById(dto.mountainId);
    const meeting = this.toMeetingPointDocs(dto.meetingPoints);
    const trip = await this.tripModel.create({
      name: dto.name.trim(),
      slug: await this.uniqueSlug(dto.name),
      mountain: toObjectId(dto.mountainId),
      mountainName: mountain.name,
      mountainSlug: mountain.slug,
      description: dto.description?.trim() ?? '',
      itinerary: dto.itinerary?.trim() || undefined,
      includes: this.cleanList(dto.includes),
      images: dto.images ?? [],
      startDate: dto.startDate,
      endDate: dto.endDate,
      meetingPoints: meeting.points,
      meetingPoint: meeting.summary.name,
      quota: dto.quota,
      pricePerPerson: meeting.summary.pricePerPerson,
      suggestedDp: meeting.summary.suggestedDp,
      whatsappPhone: dto.whatsappPhone.trim(),
      whatsappName: dto.whatsappName?.trim() || undefined,
      status: dto.status ?? OpenTripStatus.DRAFT,
    });

    return this.toResponse(trip, 0);
  }

  async findAll(query: QueryOpenTripDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }
    if (query.search?.trim()) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
      filter.$or = [
        { name: regex },
        { mountainName: regex },
        { meetingPoint: regex },
        { 'meetingPoints.name': regex },
      ];
    }
    if (query.mountainId) {
      filter.mountain = toObjectId(query.mountainId);
    }
    const from =
      query.from && query.to && query.from > query.to ? query.to : query.from;
    const to =
      query.from && query.to && query.from > query.to ? query.from : query.to;
    if (from || to) {
      if (query.overlap) {
        if (from) {
          filter.endDate = { $gte: from };
        }
        if (to) {
          filter.startDate = { $lte: to };
        }
      } else {
        const startDate: Record<string, string> = {};
        if (from) {
          startDate.$gte = from;
        }
        if (to) {
          startDate.$lte = to;
        }
        filter.startDate = startDate;
      }
    }

    const [rows, total] = await Promise.all([
      this.tripModel
        .find(filter)
        .sort({ startDate: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.tripModel.countDocuments(filter).exec(),
    ]);

    const occupancy = await this.occupiedMap(rows.map((row) => row._id));

    return {
      data: rows.map((row) =>
        this.toResponse(row, occupancy.get(row._id.toString()) ?? 0),
      ),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findPublic(query: QueryOpenTripDto) {
    return this.findAll({
      ...query,
      status: OpenTripStatus.PUBLISHED,
    });
  }

  async findPublicMountains() {
    const today = this.jakartaTodayYmd();
    const rows = await this.tripModel
      .aggregate<{ _id: Types.ObjectId; name: string }>([
        {
          $match: {
            status: OpenTripStatus.PUBLISHED,
            endDate: { $gte: today },
          },
        },
        {
          $group: {
            _id: '$mountain',
            name: { $first: '$mountainName' },
          },
        },
        { $sort: { name: 1 } },
      ])
      .exec();

    return rows.map((row) => ({
      id: row._id.toString(),
      name: row.name,
    }));
  }

  async findPublicUpcomingByMountain(mountainId: string, limit = 6) {
    const rows = await this.tripModel
      .find({
        mountain: toObjectId(mountainId),
        status: OpenTripStatus.PUBLISHED,
        endDate: { $gte: this.jakartaTodayYmd() },
      })
      .sort({ startDate: 1, createdAt: -1 })
      .limit(limit)
      .exec();
    const occupancy = await this.occupiedMap(rows.map((row) => row._id));

    return rows
      .map((row) =>
        this.toResponse(row, occupancy.get(row._id.toString()) ?? 0),
      )
      .filter((trip) => trip.remainingQuota > 0);
  }

  async findById(id: string) {
    const trip = await this.findDocument(id);
    const bookedPax = await this.occupiedPax(trip._id.toString());
    return this.toResponse(trip, bookedPax);
  }

  async findPublicBySlug(slug: string) {
    const trip = await this.tripModel.findOne({ slug }).exec();
    if (!trip || trip.status === OpenTripStatus.DRAFT) {
      throw new NotFoundException('Open trip tidak ditemukan');
    }
    const bookedPax = await this.occupiedPax(trip._id.toString());
    return this.toResponse(trip, bookedPax);
  }

  async findOptions() {
    const rows = await this.tripModel
      .find({
        status: { $in: [OpenTripStatus.PUBLISHED, OpenTripStatus.CLOSED] },
      })
      .select(
        'name mountainName startDate endDate quota status meetingPoint meetingPoints pricePerPerson suggestedDp',
      )
      .sort({ startDate: 1, name: 1 })
      .exec();
    const occupancy = await this.occupiedMap(rows.map((row) => row._id));

    return rows.map((row) => {
      const bookedPax = occupancy.get(row._id.toString()) ?? 0;
      return {
        id: row._id.toString(),
        name: row.name,
        mountainName: row.mountainName,
        startDate: row.startDate,
        endDate: row.endDate,
        quota: row.quota,
        bookedPax,
        remainingQuota: Math.max(0, row.quota - bookedPax),
        meetingPoint: row.meetingPoint,
        meetingPoints: normalizeMeetingPoints(row),
        status: row.status,
      };
    });
  }

  async update(id: string, dto: UpdateOpenTripDto) {
    const trip = await this.findDocument(id);
    const startDate = dto.startDate ?? trip.startDate;
    const endDate = dto.endDate ?? trip.endDate;
    this.assertDates(startDate, endDate);

    if (dto.name !== undefined) {
      trip.name = dto.name.trim();
      trip.slug = await this.uniqueSlug(dto.name, id);
    }
    if (dto.mountainId !== undefined) {
      const mountain = await this.mountainsService.findById(dto.mountainId);
      trip.mountain = toObjectId(dto.mountainId);
      trip.mountainName = mountain.name;
      trip.mountainSlug = mountain.slug;
    }
    if (dto.description !== undefined) {
      trip.description = dto.description.trim();
    }
    if (dto.itinerary !== undefined) {
      trip.itinerary = dto.itinerary.trim() || undefined;
    }
    if (dto.includes !== undefined) {
      trip.includes = this.cleanList(dto.includes);
    }
    if (dto.images !== undefined) {
      trip.images = dto.images;
    }
    trip.startDate = startDate;
    trip.endDate = endDate;
    if (dto.meetingPoints !== undefined) {
      const meeting = this.toMeetingPointDocs(dto.meetingPoints);
      trip.meetingPoints = meeting.points as OpenTripDocument['meetingPoints'];
      trip.meetingPoint = meeting.summary.name;
      trip.pricePerPerson = meeting.summary.pricePerPerson;
      trip.suggestedDp = meeting.summary.suggestedDp;
      trip.markModified('meetingPoints');
    }
    if (dto.quota !== undefined) {
      const bookedPax = await this.occupiedPax(id);
      if (dto.quota < bookedPax) {
        throw new BadRequestException(
          `Kuota tidak boleh lebih kecil dari peserta terbooking (${bookedPax})`,
        );
      }
      trip.quota = dto.quota;
    }
    if (dto.whatsappPhone !== undefined) {
      trip.whatsappPhone = dto.whatsappPhone.trim();
    }
    if (dto.whatsappName !== undefined) {
      trip.whatsappName = dto.whatsappName.trim() || undefined;
    }
    if (dto.status !== undefined) {
      trip.status = dto.status;
    }

    await trip.save();
    const bookedPax = await this.occupiedPax(id);
    return this.toResponse(trip, bookedPax);
  }

  async remove(id: string) {
    const trip = await this.findDocument(id);
    const bookingCount = await this.bookingModel
      .countDocuments({ openTrip: trip._id })
      .exec();
    if (bookingCount > 0) {
      throw new BadRequestException(
        'Open trip tidak bisa dihapus karena sudah ada pendaftaran',
      );
    }
    await trip.deleteOne();
  }

  async occupiedPax(tripId: string, excludeBookingId?: string) {
    if (!Types.ObjectId.isValid(tripId)) {
      return 0;
    }

    const match: Record<string, unknown> = {
      openTrip: new Types.ObjectId(tripId),
      bookingStatus: { $in: [...OCCUPYING_BOOKING_STATUSES] },
    };
    if (excludeBookingId && Types.ObjectId.isValid(excludeBookingId)) {
      match._id = { $ne: new Types.ObjectId(excludeBookingId) };
    }

    const [row] = await this.bookingModel.aggregate<{ total: number }>([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$pax' } } },
    ]);

    return row?.total ?? 0;
  }

  async remainingQuota(tripId: string, excludeBookingId?: string) {
    const trip = await this.findDocument(tripId);
    const booked = await this.occupiedPax(tripId, excludeBookingId);
    return Math.max(0, trip.quota - booked);
  }

  async findDocument(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Open trip tidak ditemukan');
    }
    const trip = await this.tripModel.findById(id).exec();
    if (!trip) {
      throw new NotFoundException('Open trip tidak ditemukan');
    }
    return trip;
  }

  private async occupiedMap(ids: Types.ObjectId[]) {
    const map = new Map<string, number>();
    if (ids.length === 0) {
      return map;
    }

    const rows = await this.bookingModel.aggregate<{
      _id: Types.ObjectId;
      total: number;
    }>([
      {
        $match: {
          openTrip: { $in: ids },
          bookingStatus: { $in: [...OCCUPYING_BOOKING_STATUSES] },
        },
      },
      { $group: { _id: '$openTrip', total: { $sum: '$pax' } } },
    ]);

    for (const row of rows) {
      map.set(row._id.toString(), row.total);
    }
    return map;
  }

  private async uniqueSlug(name: string, excludeId?: string) {
    const base = slugify(name) || 'open-trip';
    let slug = base;
    let suffix = 2;

    while (await this.slugTaken(slug, excludeId)) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  private async slugTaken(slug: string, excludeId?: string) {
    const existing = await this.tripModel.findOne({ slug }).exec();
    if (!existing) {
      return false;
    }
    return existing._id.toString() !== excludeId;
  }

  private assertDates(startDate: string, endDate: string) {
    if (endDate < startDate) {
      throw new BadRequestException(
        'Tanggal selesai tidak boleh sebelum tanggal mulai',
      );
    }
  }

  private cleanList(values?: string[]) {
    return (values ?? [])
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }

  private toMeetingPointDocs(
    items: Array<{
      id?: string;
      name: string;
      pricePerPerson: number;
      suggestedDp?: number;
    }>,
  ) {
    const points = items
      .map((item) => {
        const name = item.name.trim();
        if (!name) {
          return null;
        }
        const doc: {
          _id?: Types.ObjectId;
          name: string;
          pricePerPerson: number;
          suggestedDp: number;
        } = {
          name,
          pricePerPerson: item.pricePerPerson,
          suggestedDp: item.suggestedDp ?? 0,
        };
        if (item.id && Types.ObjectId.isValid(item.id)) {
          doc._id = new Types.ObjectId(item.id);
        }
        return doc;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (points.length === 0) {
      throw new BadRequestException('Minimal satu titik kumpul / mepo');
    }

    const cheapest = [...points].sort(
      (left, right) => left.pricePerPerson - right.pricePerPerson,
    )[0];

    return {
      points,
      summary: {
        name: points[0].name,
        pricePerPerson: cheapest.pricePerPerson,
        suggestedDp: cheapest.suggestedDp,
      },
    };
  }

  toResponse(trip: OpenTripDocument, bookedPax: number): OpenTripResponseDto {
    const mountainId =
      trip.mountain instanceof Types.ObjectId
        ? trip.mountain.toString()
        : String(trip.mountain);

    return {
      id: trip._id.toString(),
      name: trip.name,
      slug: trip.slug,
      mountain: {
        id: mountainId,
        name: trip.mountainName,
        slug: trip.mountainSlug,
      },
      description: trip.description ?? '',
      itinerary: trip.itinerary,
      includes: trip.includes ?? [],
      images: trip.images ?? [],
      startDate: trip.startDate,
      endDate: trip.endDate,
      meetingPoints: normalizeMeetingPoints(trip),
      meetingPoint: trip.meetingPoint,
      quota: trip.quota,
      bookedPax,
      remainingQuota: Math.max(0, trip.quota - bookedPax),
      pricePerPerson: trip.pricePerPerson,
      suggestedDp: trip.suggestedDp ?? 0,
      whatsappPhone: trip.whatsappPhone,
      whatsappName: trip.whatsappName,
      status: trip.status,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }

  private jakartaTodayYmd() {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
    }).format(new Date());
  }
}
