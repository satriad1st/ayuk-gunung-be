import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { escapeRegex } from '../../common/utils/escape-regex';
import { toObjectId } from '../../common/utils/object-id';
import { MountainsService } from '../mountains/mountains.service';
import { addDaysYmd, moneyTotals } from './booking-money';
import { AddBookingPaymentDto } from './dto/add-payment.dto';
import { PrivateTripBookingResponseDto } from './dto/booking-response.dto';
import { CreatePrivateTripBookingDto } from './dto/create-booking.dto';
import { QueryPrivateTripBookingDto } from './dto/query-booking.dto';
import { UpdatePrivateTripBookingDto } from './dto/update-booking.dto';
import {
  PaymentMethod,
  PrivateTripBooking,
  PrivateTripBookingDocument,
} from './schemas/private-trip-booking.schema';

type PaymentSubdoc = {
  _id: Types.ObjectId;
  amount: number;
  paidAt: Date;
  method: PaymentMethod;
  note?: string;
  createdAt?: Date;
};

@Injectable()
export class PrivateTripBookingsService {
  constructor(
    @InjectModel(PrivateTripBooking.name)
    private readonly bookingModel: Model<PrivateTripBookingDocument>,
    private readonly mountainsService: MountainsService,
  ) {}

  async findAll(query: QueryPrivateTripBookingDto) {
    const from = query.from ?? this.monthStart();
    const to = query.to ?? this.monthEnd();
    const filter: Record<string, unknown> = {
      startDate: { $lte: to },
      endDate: { $gte: from },
    };

    if (query.paymentStatus) {
      filter.paymentStatus = query.paymentStatus;
    }
    if (query.tripType) {
      filter.tripType = query.tripType;
    }
    if (query.search?.trim()) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
      filter.$or = [
        { customerName: regex },
        { customerPhone: regex },
        { customerEmail: regex },
        { mountainName: regex },
      ];
    }

    const rows = await this.bookingModel
      .find(filter)
      .sort({ startDate: 1, customerName: 1 })
      .limit(500)
      .exec();

    return {
      data: rows.map((row) => this.toResponse(row)),
      from,
      to,
      total: rows.length,
    };
  }

  async findById(id: string) {
    return this.toResponse(await this.findDocument(id));
  }

  async create(dto: CreatePrivateTripBookingDto) {
    this.assertDuration(dto.days, dto.nights);
    const mountain = await this.mountainsService.findById(dto.mountainId);
    const payments = dto.firstPayment
      ? [this.toPayment(dto.firstPayment)]
      : [];
    const paidAmount = payments.reduce((sum, item) => sum + item.amount, 0);
    const money = this.assertMoney({
      pax: dto.pax,
      pricePerPerson: dto.pricePerPerson,
      discount: dto.discount ?? 0,
      paidAmount,
    });
    if (paidAmount > money.finalPrice) {
      throw new BadRequestException('Pembayaran awal melebihi harga final');
    }

    const booking = await this.bookingModel.create({
      customerName: dto.customerName.trim(),
      customerPhone: dto.customerPhone.trim(),
      customerEmail: dto.customerEmail?.trim().toLowerCase() || undefined,
      pax: dto.pax,
      mountain: toObjectId(dto.mountainId),
      mountainName: mountain.name,
      tripType: dto.tripType,
      days: dto.days,
      nights: dto.nights,
      startDate: dto.startDate,
      endDate: addDaysYmd(dto.startDate, dto.days - 1),
      pricePerPerson: dto.pricePerPerson,
      ...money,
      notes: dto.notes?.trim() || undefined,
      payments,
    });

    return this.toResponse(booking);
  }

  async update(id: string, dto: UpdatePrivateTripBookingDto) {
    const booking = await this.findDocument(id);
    const days = dto.days ?? booking.days;
    const nights = dto.nights ?? booking.nights;
    this.assertDuration(days, nights);

    if (dto.customerName !== undefined) {
      booking.customerName = dto.customerName.trim();
    }
    if (dto.customerPhone !== undefined) {
      booking.customerPhone = dto.customerPhone.trim();
    }
    if (dto.customerEmail !== undefined) {
      booking.customerEmail = dto.customerEmail.trim().toLowerCase() || undefined;
    }
    if (dto.pax !== undefined) {
      booking.pax = dto.pax;
    }
    if (dto.mountainId !== undefined) {
      const mountain = await this.mountainsService.findById(dto.mountainId);
      booking.mountain = toObjectId(dto.mountainId);
      booking.mountainName = mountain.name;
    }
    if (dto.tripType !== undefined) {
      booking.tripType = dto.tripType;
    }
    booking.days = days;
    booking.nights = nights;
    if (dto.startDate !== undefined) {
      booking.startDate = dto.startDate;
    }
    booking.endDate = addDaysYmd(booking.startDate, booking.days - 1);
    if (dto.pricePerPerson !== undefined) {
      booking.pricePerPerson = dto.pricePerPerson;
    }
    if (dto.notes !== undefined) {
      booking.notes = dto.notes.trim() || undefined;
    }

    const paidAmount = this.sumPayments(booking.payments);
    const money = this.assertMoney({
      pax: booking.pax,
      pricePerPerson: booking.pricePerPerson,
      discount: dto.discount ?? booking.discount,
      paidAmount,
    });
    Object.assign(booking, money);
    await booking.save();
    return this.toResponse(booking);
  }

  async remove(id: string) {
    const booking = await this.findDocument(id);
    await booking.deleteOne();
  }

  async addPayment(id: string, dto: AddBookingPaymentDto) {
    const booking = await this.findDocument(id);
    const remaining = booking.remainingAmount;
    if (remaining <= 0) {
      throw new BadRequestException('Booking ini sudah lunas');
    }
    if (dto.amount > remaining) {
      throw new BadRequestException(
        `Nominal melebihi sisa tagihan Rp ${remaining.toLocaleString('id-ID')}`,
      );
    }

    booking.payments.push(this.toPayment(dto));
    booking.markModified('payments');
    Object.assign(
      booking,
      moneyTotals({
        pax: booking.pax,
        pricePerPerson: booking.pricePerPerson,
        discount: booking.discount,
        paidAmount: this.sumPayments(booking.payments),
      }),
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
    Object.assign(
      booking,
      moneyTotals({
        pax: booking.pax,
        pricePerPerson: booking.pricePerPerson,
        discount: booking.discount,
        paidAmount: this.sumPayments(booking.payments),
      }),
    );
    await booking.save();
    return this.toResponse(booking);
  }

  private async findDocument(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Booking tidak ditemukan');
    }
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }
    return booking;
  }

  private assertDuration(days: number, nights: number) {
    if (nights > days) {
      throw new BadRequestException(
        'Jumlah malam tidak boleh lebih besar dari jumlah hari',
      );
    }
  }

  private assertMoney(input: {
    pax: number;
    pricePerPerson: number;
    discount: number;
    paidAmount: number;
  }) {
    const subtotal = Math.round(input.pax * input.pricePerPerson);
    if (input.discount > subtotal) {
      throw new BadRequestException('Diskon tidak boleh melebihi subtotal');
    }
    return moneyTotals(input);
  }

  private toPayment(dto: AddBookingPaymentDto): {
    amount: number;
    method: PaymentMethod;
    note?: string;
    paidAt: Date;
  } {
    return {
      amount: dto.amount,
      method: dto.method ?? PaymentMethod.TRANSFER,
      note: dto.note?.trim() || undefined,
      paidAt: dto.paidAt ? this.dateFromYmd(dto.paidAt) : new Date(),
    };
  }

  private sumPayments(
    payments: Array<{ amount: number }> | PrivateTripBookingDocument['payments'],
  ): number {
    let total = 0;
    for (const item of payments) {
      total += item.amount;
    }
    return total;
  }

  private dateFromYmd(ymd: string) {
    const [year, month, day] = ymd.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12));
  }

  private monthStart() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  }

  private monthEnd() {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(last).padStart(2, '0')}`;
  }

  private toResponse(
    booking: PrivateTripBookingDocument,
  ): PrivateTripBookingResponseDto {
    const mountainId =
      booking.mountain instanceof Types.ObjectId
        ? booking.mountain.toString()
        : String(booking.mountain);

    return {
      id: booking._id.toString(),
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      pax: booking.pax,
      mountain: {
        id: mountainId,
        name: booking.mountainName,
      },
      tripType: booking.tripType,
      days: booking.days,
      nights: booking.nights,
      startDate: booking.startDate,
      endDate: booking.endDate,
      pricePerPerson: booking.pricePerPerson,
      subtotal: booking.subtotal,
      discount: booking.discount,
      finalPrice: booking.finalPrice,
      notes: booking.notes,
      payments: (booking.payments as unknown as PaymentSubdoc[]).map(
        (payment) => ({
          id: payment._id.toString(),
          amount: payment.amount,
          paidAt: payment.paidAt,
          method: payment.method,
          note: payment.note,
          createdAt: payment.createdAt ?? payment.paidAt,
        }),
      ),
      paidAmount: booking.paidAmount,
      remainingAmount: booking.remainingAmount,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }
}
