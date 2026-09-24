import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { escapeRegex } from '../../common/utils/escape-regex';
import { toObjectId } from '../../common/utils/object-id';
import { UsersService } from '../users/users.service';
import {
  AddOpenTripPaymentDto,
  CreateOpenTripBookingDto,
  QueryOpenTripBookingDto,
  RegisterOpenTripDto,
  UpdateOpenTripBookingDto,
} from './dto/booking.dto';
import {
  OpenTripBookingResponseDto,
  UserOpenTripBookingDto,
} from './dto/booking-response.dto';
import {
  buildInquiryWhatsappMessage,
  findMeetingPoint,
  moneyTotals,
  normalizeAddons,
  resolveBookingStatus,
  sumAddonTotal,
  toPayment,
  whatsappUrl,
} from './open-trip.helpers';
import { OpenTripService } from './open-trip.service';
import {
  OCCUPYING_BOOKING_STATUSES,
  OpenTripBooking,
  OpenTripBookingDocument,
  OpenTripBookingStatus,
  OpenTripPaymentChannel,
  OpenTripPaymentMethod,
} from './schemas/open-trip-booking.schema';
import { OpenTripStatus } from './schemas/open-trip.schema';

type PaymentSubdoc = {
  _id: Types.ObjectId;
  amount: number;
  paidAt: Date;
  method: OpenTripPaymentMethod;
  note?: string;
  createdAt?: Date;
};

@Injectable()
export class OpenTripBookingsService {
  constructor(
    @InjectModel(OpenTripBooking.name)
    private readonly bookingModel: Model<OpenTripBookingDocument>,
    private readonly openTripService: OpenTripService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(query: QueryOpenTripBookingDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter: Record<string, unknown> = {};

    if (query.openTripId) {
      filter.openTrip = toObjectId(query.openTripId);
    }
    if (query.bookingStatus) {
      filter.bookingStatus = query.bookingStatus;
    }
    if (query.search?.trim()) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
      filter.$or = [
        { bookerName: regex },
        { bookerPhone: regex },
        { bookerEmail: regex },
        { openTripName: regex },
        { mountainName: regex },
      ];
    }
    const from =
      query.from && query.to && query.from > query.to ? query.to : query.from;
    const to =
      query.from && query.to && query.from > query.to ? query.from : query.to;
    if (from || to) {
      const tripStartDate: Record<string, string> = {};
      if (from) {
        tripStartDate.$gte = from;
      }
      if (to) {
        tripStartDate.$lte = to;
      }
      filter.tripStartDate = tripStartDate;
    }

    const [rows, total] = await Promise.all([
      this.bookingModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.bookingModel.countDocuments(filter).exec(),
    ]);

    return {
      data: rows.map((row) => this.toResponse(row)),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id: string) {
    return this.toResponse(await this.findDocument(id));
  }

  async findForUser(user: AuthUser) {
    const email = user.email.trim().toLowerCase();
    const filter: Record<string, unknown> = {
      $or: [{ user: toObjectId(user.id) }],
    };
    if (email) {
      (filter.$or as Array<Record<string, unknown>>).push({
        bookerEmail: email,
      });
    }

    const rows = await this.bookingModel
      .find(filter)
      .sort({ tripStartDate: -1, createdAt: -1 })
      .exec();

    return {
      data: rows.map((row) => this.toUserResponse(row)),
      total: rows.length,
    };
  }

  async create(dto: CreateOpenTripBookingDto) {
    this.assertParticipants(dto.pax, dto.participants);
    const trip = await this.openTripService.findDocument(dto.openTripId);
    const bookingStatus =
      dto.bookingStatus ?? OpenTripBookingStatus.BOOKING;
    await this.assertQuota(trip._id.toString(), dto.pax, bookingStatus);

    const mepo = this.requireMeetingPoint(trip, dto.meetingPointId);
    const payments = dto.firstPaymentAmount
      ? [
          toPayment({
            amount: dto.firstPaymentAmount,
            method: dto.firstPaymentMethod,
          }),
        ]
      : [];
    const paidAmount = payments.reduce((sum, item) => sum + item.amount, 0);
    const addons = normalizeAddons(dto.addons);
    const money = moneyTotals({
      pax: dto.pax,
      pricePerPerson: mepo.pricePerPerson,
      addonTotal: sumAddonTotal(addons),
      paidAmount,
    });
    if (paidAmount > money.finalPrice) {
      throw new BadRequestException('Pembayaran awal melebihi harga final');
    }
    const resolvedStatus = resolveBookingStatus({
      requested: bookingStatus,
      paidAmount: money.paidAmount,
      remainingAmount: money.remainingAmount,
    });

    const user = dto.bookerEmail
      ? await this.usersService.findByEmail(dto.bookerEmail)
      : null;

    const booking = await this.bookingModel.create({
      openTrip: trip._id,
      openTripName: trip.name,
      mountainName: trip.mountainName,
      tripStartDate: trip.startDate,
      tripEndDate: trip.endDate,
      user: user?._id,
      bookerName: dto.bookerName.trim(),
      bookerPhone: dto.bookerPhone.trim(),
      bookerEmail: dto.bookerEmail?.trim().toLowerCase() || undefined,
      meetingPointId: mepo.id,
      meetingPoint: mepo.name,
      meetingGatherDate: mepo.gatherDate,
      meetingGatherTime: mepo.gatherTime,
      pricePerPerson: mepo.pricePerPerson,
      pax: dto.pax,
      participants: dto.participants.map((person) => ({
        name: person.name.trim(),
        phone: person.phone.trim(),
        gender: person.gender,
        birthDate: person.birthDate,
      })),
      addons,
      paymentChannel: dto.paymentChannel ?? OpenTripPaymentChannel.ADMIN,
      bookingStatus: resolvedStatus,
      ...money,
      notes: dto.notes?.trim() || undefined,
      payments,
      source: 'admin',
    });

    return this.toResponse(booking, trip.whatsappPhone, trip.whatsappName);
  }

  async register(user: AuthUser, dto: RegisterOpenTripDto) {
    this.assertParticipants(dto.pax, dto.participants);
    const trip = await this.openTripService.findDocument(dto.openTripId);
    if (trip.status !== OpenTripStatus.PUBLISHED) {
      throw new BadRequestException('Open trip ini belum dibuka untuk daftar');
    }
    await this.assertQuota(
      trip._id.toString(),
      dto.pax,
      OpenTripBookingStatus.BOOKING,
    );

    const mepo = this.requireMeetingPoint(trip, dto.meetingPointId);
    const money = moneyTotals({
      pax: dto.pax,
      pricePerPerson: mepo.pricePerPerson,
      paidAmount: 0,
    });

    const booking = await this.bookingModel.create({
      openTrip: trip._id,
      openTripName: trip.name,
      mountainName: trip.mountainName,
      tripStartDate: trip.startDate,
      tripEndDate: trip.endDate,
      user: toObjectId(user.id),
      bookerName: dto.bookerName.trim(),
      bookerPhone: dto.bookerPhone.trim(),
      bookerEmail: user.email.trim().toLowerCase(),
      meetingPointId: mepo.id,
      meetingPoint: mepo.name,
      meetingGatherDate: mepo.gatherDate,
      meetingGatherTime: mepo.gatherTime,
      pricePerPerson: mepo.pricePerPerson,
      pax: dto.pax,
      participants: dto.participants.map((person) => ({
        name: person.name.trim(),
        phone: person.phone.trim(),
        gender: person.gender,
        birthDate: person.birthDate,
      })),
      addons: [],
      paymentChannel: OpenTripPaymentChannel.ADMIN,
      bookingStatus: OpenTripBookingStatus.INQUIRY,
      ...money,
      payments: [],
      source: 'web',
    });

    return this.toResponse(booking, trip.whatsappPhone, trip.whatsappName);
  }

  async update(id: string, dto: UpdateOpenTripBookingDto) {
    const booking = await this.findDocument(id);
    let trip = await this.openTripService.findDocument(
      booking.openTrip.toString(),
    );

    if (dto.openTripId && dto.openTripId !== booking.openTrip.toString()) {
      trip = await this.openTripService.findDocument(dto.openTripId);
      booking.openTrip = trip._id;
      booking.openTripName = trip.name;
      booking.mountainName = trip.mountainName;
      booking.tripStartDate = trip.startDate;
      booking.tripEndDate = trip.endDate;
    }

    if (dto.bookerName !== undefined) {
      booking.bookerName = dto.bookerName.trim();
    }
    if (dto.bookerPhone !== undefined) {
      booking.bookerPhone = dto.bookerPhone.trim();
    }
    if (dto.bookerEmail !== undefined) {
      booking.bookerEmail = dto.bookerEmail.trim().toLowerCase() || undefined;
      const user = booking.bookerEmail
        ? await this.usersService.findByEmail(booking.bookerEmail)
        : null;
      booking.user = user?._id;
    }
    if (dto.meetingPointId !== undefined) {
      const mepo = this.requireMeetingPoint(trip, dto.meetingPointId);
      booking.meetingPointId = mepo.id;
      booking.meetingPoint = mepo.name;
      booking.meetingGatherDate = mepo.gatherDate;
      booking.meetingGatherTime = mepo.gatherTime;
      booking.pricePerPerson = mepo.pricePerPerson;
    }
    if (dto.pax !== undefined) {
      booking.pax = dto.pax;
    }
    if (dto.participants !== undefined) {
      booking.participants = dto.participants.map((person) => ({
        name: person.name.trim(),
        phone: person.phone.trim(),
        gender: person.gender,
        birthDate: person.birthDate,
      }));
    }
    if (dto.addons !== undefined) {
      booking.addons = normalizeAddons(dto.addons);
    }
    if (dto.notes !== undefined) {
      booking.notes = dto.notes.trim() || undefined;
    }

    this.assertParticipants(booking.pax, booking.participants);

    const bookingStatus = dto.bookingStatus ?? booking.bookingStatus;
    await this.assertQuota(
      trip._id.toString(),
      booking.pax,
      bookingStatus,
      booking._id.toString(),
    );

    const paidAmount = this.sumPayments(booking.payments);
    const pricePerPerson =
      booking.pricePerPerson ||
      this.requireMeetingPoint(trip, booking.meetingPointId, booking.meetingPoint)
        .pricePerPerson;
    booking.pricePerPerson = pricePerPerson;
    const money = moneyTotals({
      pax: booking.pax,
      pricePerPerson,
      addonTotal: sumAddonTotal(booking.addons ?? []),
      paidAmount,
    });
    Object.assign(booking, money);
    booking.bookingStatus = resolveBookingStatus({
      requested: bookingStatus,
      paidAmount: money.paidAmount,
      remainingAmount: money.remainingAmount,
    });

    await booking.save();
    return this.toResponse(booking, trip.whatsappPhone, trip.whatsappName);
  }

  async remove(id: string) {
    const booking = await this.findDocument(id);
    await booking.deleteOne();
  }

  async addPayment(id: string, dto: AddOpenTripPaymentDto) {
    const booking = await this.findDocument(id);
    if (booking.remainingAmount <= 0) {
      throw new BadRequestException('Pendaftaran ini sudah lunas');
    }
    if (dto.amount > booking.remainingAmount) {
      throw new BadRequestException(
        `Nominal melebihi sisa tagihan Rp ${booking.remainingAmount.toLocaleString('id-ID')}`,
      );
    }

    booking.payments.push(toPayment(dto));
    booking.markModified('payments');
    const trip = await this.openTripService.findDocument(
      booking.openTrip.toString(),
    );
    const pricePerPerson =
      booking.pricePerPerson ||
      this.requireMeetingPoint(trip, booking.meetingPointId, booking.meetingPoint)
        .pricePerPerson;
    const money = moneyTotals({
      pax: booking.pax,
      pricePerPerson,
      addonTotal: sumAddonTotal(booking.addons ?? []),
      paidAmount: this.sumPayments(booking.payments),
    });
    Object.assign(booking, money);
    booking.bookingStatus = resolveBookingStatus({
      requested:
        booking.bookingStatus === OpenTripBookingStatus.INQUIRY
          ? OpenTripBookingStatus.BOOKING
          : booking.bookingStatus,
      paidAmount: money.paidAmount,
      remainingAmount: money.remainingAmount,
    });
    await this.assertQuota(
      trip._id.toString(),
      booking.pax,
      booking.bookingStatus,
      booking._id.toString(),
    );
    await booking.save();
    return this.toResponse(booking);
  }

  async removePayment(id: string, paymentId: string) {
    const booking = await this.findDocument(id);
    const payments = booking.payments as unknown as PaymentSubdoc[];
    const index = payments.findIndex(
      (item) => item._id.toString() === paymentId,
    );
    if (index < 0) {
      throw new NotFoundException('Riwayat pembayaran tidak ditemukan');
    }
    booking.payments.splice(index, 1);
    booking.markModified('payments');
    const trip = await this.openTripService.findDocument(
      booking.openTrip.toString(),
    );
    const pricePerPerson =
      booking.pricePerPerson ||
      this.requireMeetingPoint(trip, booking.meetingPointId, booking.meetingPoint)
        .pricePerPerson;
    const money = moneyTotals({
      pax: booking.pax,
      pricePerPerson,
      addonTotal: sumAddonTotal(booking.addons ?? []),
      paidAmount: this.sumPayments(booking.payments),
    });
    Object.assign(booking, money);
    booking.bookingStatus = resolveBookingStatus({
      requested: booking.bookingStatus,
      paidAmount: money.paidAmount,
      remainingAmount: money.remainingAmount,
    });
    await booking.save();
    return this.toResponse(booking);
  }

  private async assertQuota(
    tripId: string,
    pax: number,
    status: OpenTripBookingStatus,
    excludeBookingId?: string,
  ) {
    if (
      !OCCUPYING_BOOKING_STATUSES.includes(
        status as (typeof OCCUPYING_BOOKING_STATUSES)[number],
      )
    ) {
      return;
    }
    const remaining = await this.openTripService.remainingQuota(
      tripId,
      excludeBookingId,
    );
    if (pax > remaining) {
      throw new BadRequestException(
        remaining <= 0
          ? 'Kuota open trip sudah penuh'
          : `Sisa kuota hanya ${remaining} orang`,
      );
    }
  }

  private requireMeetingPoint(
    trip: Parameters<typeof findMeetingPoint>[0],
    meetingPointId?: string,
    meetingPointName?: string,
  ) {
    const mepo = findMeetingPoint(trip, meetingPointId, meetingPointName);
    if (!mepo) {
      throw new BadRequestException('Pilih titik kumpul / mepo yang tersedia');
    }
    return mepo;
  }

  private assertParticipants(
    pax: number,
    participants: Array<{ name: string }>,
  ) {
    if (participants.length !== pax) {
      throw new BadRequestException(
        'Jumlah data peserta harus sama dengan jumlah orang',
      );
    }
  }

  private async findDocument(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Pendaftaran tidak ditemukan');
    }
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException('Pendaftaran tidak ditemukan');
    }
    return booking;
  }

  private sumPayments(
    payments: Array<{ amount: number }> | OpenTripBookingDocument['payments'],
  ) {
    let total = 0;
    for (const item of payments) {
      total += item.amount;
    }
    return total;
  }

  private toResponse(
    booking: OpenTripBookingDocument,
    whatsappPhone?: string,
    whatsappName?: string,
  ): OpenTripBookingResponseDto {
    const tripId =
      booking.openTrip instanceof Types.ObjectId
        ? booking.openTrip.toString()
        : String(booking.openTrip);
    const userId =
      booking.user instanceof Types.ObjectId
        ? booking.user.toString()
        : booking.user
          ? String(booking.user)
          : undefined;
    const payments = (booking.payments as unknown as PaymentSubdoc[]).map(
      (payment) => ({
        id: payment._id.toString(),
        amount: payment.amount,
        paidAt: payment.paidAt,
        method: payment.method,
        note: payment.note,
        createdAt: payment.createdAt ?? payment.paidAt,
      }),
    );
    const addons = (booking.addons ?? []).map((item) => ({
      name: item.name,
      price: item.price,
    }));
    const addonTotal = booking.addonTotal ?? sumAddonTotal(addons);
    const message = whatsappPhone
      ? buildInquiryWhatsappMessage({
          tripName: booking.openTripName,
          mountainName: booking.mountainName,
          startDate: booking.tripStartDate,
          endDate: booking.tripEndDate,
          bookerName: booking.bookerName,
          bookerPhone: booking.bookerPhone,
          meetingPoint: booking.meetingPoint,
          gatherDate: booking.meetingGatherDate,
          gatherTime: booking.meetingGatherTime,
          pax: booking.pax,
          pricePerPerson: booking.pricePerPerson,
          addons,
          contactName: whatsappName,
          participants: booking.participants,
        })
      : undefined;

    return {
      id: booking._id.toString(),
      openTrip: {
        id: tripId,
        name: booking.openTripName,
        mountainName: booking.mountainName,
        startDate: booking.tripStartDate,
        endDate: booking.tripEndDate,
      },
      userId,
      bookerName: booking.bookerName,
      bookerPhone: booking.bookerPhone,
      bookerEmail: booking.bookerEmail,
      meetingPointId: booking.meetingPointId,
      meetingPoint: booking.meetingPoint,
      meetingGatherDate: booking.meetingGatherDate,
      meetingGatherTime: booking.meetingGatherTime,
      pax: booking.pax,
      participants: booking.participants.map((person) => ({
        name: person.name,
        phone: person.phone,
        gender: person.gender,
        birthDate: person.birthDate,
      })),
      addons,
      addonTotal,
      paymentChannel: booking.paymentChannel,
      bookingStatus: booking.bookingStatus,
      pricePerPerson:
        booking.pricePerPerson ||
        Math.round(
          booking.pax > 0
            ? (booking.finalPrice - addonTotal) / booking.pax
            : 0,
        ),
      finalPrice: booking.finalPrice,
      paidAmount: booking.paidAmount,
      remainingAmount: booking.remainingAmount,
      payments,
      notes: booking.notes,
      source: booking.source,
      whatsappUrl: whatsappPhone
        ? whatsappUrl(whatsappPhone, message ?? '')
        : undefined,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  private toUserResponse(
    booking: OpenTripBookingDocument,
  ): UserOpenTripBookingDto {
    const payments = [
      ...(booking.payments as unknown as PaymentSubdoc[]),
    ].sort(
      (left, right) =>
        new Date(left.paidAt).getTime() - new Date(right.paidAt).getTime(),
    );

    const addons = (booking.addons ?? []).map((item) => ({
      name: item.name,
      price: item.price,
    }));
    const addonTotal = booking.addonTotal ?? sumAddonTotal(addons);

    return {
      id: booking._id.toString(),
      openTripName: booking.openTripName,
      mountainName: booking.mountainName,
      tripStartDate: booking.tripStartDate,
      tripEndDate: booking.tripEndDate,
      bookerName: booking.bookerName,
      meetingPoint: booking.meetingPoint,
      meetingGatherDate: booking.meetingGatherDate,
      meetingGatherTime: booking.meetingGatherTime,
      pricePerPerson:
        booking.pricePerPerson ||
        Math.round(
          booking.pax > 0
            ? (booking.finalPrice - addonTotal) / booking.pax
            : 0,
        ),
      pax: booking.pax,
      participants: booking.participants.map((person) => ({
        name: person.name,
        phone: person.phone,
        gender: person.gender,
        birthDate: person.birthDate,
      })),
      addons,
      addonTotal,
      bookingStatus: booking.bookingStatus,
      finalPrice: booking.finalPrice,
      paidAmount: booking.paidAmount,
      remainingAmount: booking.remainingAmount,
      payments: payments.map((payment) => ({
        id: payment._id.toString(),
        amount: payment.amount,
        paidAt: payment.paidAt,
        method: payment.method,
        note: payment.note,
        createdAt: payment.createdAt ?? payment.paidAt,
      })),
      createdAt: booking.createdAt,
    };
  }
}
