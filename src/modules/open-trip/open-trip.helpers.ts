import {
  OpenTripBookingStatus,
  OpenTripPaymentMethod,
} from './schemas/open-trip-booking.schema';

export function formatIdDate(ymd: string) {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatGatherTime(hm?: string) {
  if (!hm?.trim()) {
    return '';
  }
  const [hour, minute] = hm.split(':');
  if (!hour || !minute) {
    return hm;
  }
  return `${hour}.${minute}`;
}

export function formatMeetingSchedule(input: {
  gatherDate?: string;
  gatherTime?: string;
}) {
  const date = input.gatherDate ? formatIdDate(input.gatherDate) : '';
  const time = input.gatherTime
    ? `pukul ${formatGatherTime(input.gatherTime)}`
    : '';
  return [date, time].filter(Boolean).join(', ');
}

export type MeetingPointView = {
  id: string;
  name: string;
  pricePerPerson: number;
  suggestedDp: number;
  gatherDate?: string;
  gatherTime?: string;
};

type MeetingPointSource = {
  meetingPoints?: Array<{
    _id?: { toString(): string };
    id?: string;
    name: string;
    pricePerPerson: number;
    suggestedDp?: number;
    gatherDate?: string;
    gatherTime?: string;
  }>;
  meetingPoint?: string;
  pricePerPerson?: number;
  suggestedDp?: number;
};

export function normalizeMeetingPoints(
  trip: MeetingPointSource,
): MeetingPointView[] {
  const rows = trip.meetingPoints ?? [];
  if (rows.length > 0) {
    return rows.map((row, index) => ({
      id: row._id?.toString() ?? row.id ?? `mepo-${index}`,
      name: row.name,
      pricePerPerson: row.pricePerPerson,
      suggestedDp: row.suggestedDp ?? 0,
      gatherDate: row.gatherDate || undefined,
      gatherTime: row.gatherTime || undefined,
    }));
  }

  if (trip.meetingPoint?.trim()) {
    return [
      {
        id: 'legacy',
        name: trip.meetingPoint.trim(),
        pricePerPerson: trip.pricePerPerson ?? 0,
        suggestedDp: trip.suggestedDp ?? 0,
      },
    ];
  }

  return [];
}

export function findMeetingPoint(
  trip: MeetingPointSource,
  meetingPointId?: string,
  meetingPointName?: string,
) {
  const points = normalizeMeetingPoints(trip);
  if (meetingPointId) {
    const byId = points.find((item) => item.id === meetingPointId);
    if (byId) {
      return byId;
    }
  }
  if (meetingPointName?.trim()) {
    const byName = points.find(
      (item) => item.name.toLowerCase() === meetingPointName.trim().toLowerCase(),
    );
    if (byName) {
      return byName;
    }
  }
  return undefined;
}

export type BookingAddonInput = {
  name: string;
  price: number;
};

export function normalizeAddons(items?: BookingAddonInput[]) {
  if (!items?.length) {
    return [];
  }
  return items
    .map((item) => ({
      name: item.name.trim(),
      price: Math.max(0, Math.round(Number(item.price) || 0)),
    }))
    .filter((item) => item.name.length > 0);
}

export function sumAddonTotal(addons: Array<{ price: number }>) {
  return addons.reduce((sum, item) => sum + Math.round(item.price || 0), 0);
}

export function moneyTotals(input: {
  pax: number;
  pricePerPerson: number;
  addonTotal?: number;
  paidAmount?: number;
}) {
  const tripTotal = Math.round(input.pax * input.pricePerPerson);
  const addonTotal = Math.round(input.addonTotal ?? 0);
  const finalPrice = tripTotal + addonTotal;
  const paidAmount = Math.round(input.paidAmount ?? 0);
  const remainingAmount = Math.max(0, finalPrice - paidAmount);
  return { finalPrice, paidAmount, remainingAmount, addonTotal };
}

export function resolveBookingStatus(input: {
  requested?: OpenTripBookingStatus;
  current?: OpenTripBookingStatus;
  paidAmount: number;
  remainingAmount: number;
}) {
  const current = input.requested ?? input.current ?? OpenTripBookingStatus.BOOKING;
  if (current === OpenTripBookingStatus.INQUIRY) {
    return OpenTripBookingStatus.INQUIRY;
  }
  if (input.remainingAmount <= 0 && input.paidAmount > 0) {
    return OpenTripBookingStatus.PAID;
  }
  if (input.paidAmount > 0) {
    return OpenTripBookingStatus.DP;
  }
  if (current === OpenTripBookingStatus.PAID) {
    return OpenTripBookingStatus.BOOKING;
  }
  return current;
}

export function whatsappUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('0')
    ? `62${digits.slice(1)}`
    : digits.startsWith('62')
      ? digits
      : digits;

  if (normalized.length < 10) {
    return undefined;
  }

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function genderLabel(gender: string) {
  return gender === 'female' ? 'Perempuan' : 'Laki-laki';
}

export function buildInquiryWhatsappMessage(input: {
  tripName: string;
  mountainName: string;
  startDate: string;
  endDate: string;
  bookerName: string;
  bookerPhone: string;
  meetingPoint: string;
  gatherDate?: string;
  gatherTime?: string;
  pax: number;
  pricePerPerson?: number;
  addons?: Array<{ name: string; price: number }>;
  contactName?: string;
  participants: Array<{
    name: string;
    phone: string;
    gender: string;
    birthDate: string;
  }>;
}) {
  const contact = input.contactName?.trim() || 'Admin Ayuk Gunung';
  const dates =
    input.startDate === input.endDate
      ? formatIdDate(input.startDate)
      : `${formatIdDate(input.startDate)} – ${formatIdDate(input.endDate)}`;
  const people = input.participants
    .map(
      (person, index) =>
        `${index + 1}. ${person.name} / ${person.phone} / ${genderLabel(person.gender)} / ${formatIdDate(person.birthDate)}`,
    )
    .join('\n');
  const addons = normalizeAddons(input.addons);
  const extras = sumAddonTotal(addons);
  const tripTotal = Math.round((input.pricePerPerson ?? 0) * input.pax);
  const addonLines = addons
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} — Rp ${item.price.toLocaleString('id-ID')}`,
    )
    .join('\n');

  return [
    `Halo ${contact}, saya ingin daftar Open Trip:`,
    '',
    `Trip: ${input.tripName}`,
    `Gunung: ${input.mountainName}`,
    `Tanggal: ${dates}`,
    `Pemesan: ${input.bookerName}`,
    `HP: ${input.bookerPhone}`,
    `Titik kumpul: ${input.meetingPoint}${
      formatMeetingSchedule(input)
        ? ` (${formatMeetingSchedule(input)})`
        : ''
    }`,
    `Jumlah peserta: ${input.pax} orang`,
    tripTotal > 0
      ? `Harga trip: Rp ${tripTotal.toLocaleString('id-ID')}`
      : undefined,
    extras > 0 ? `Add-on: Rp ${extras.toLocaleString('id-ID')}` : undefined,
    tripTotal + extras > 0
      ? `Estimasi total: Rp ${(tripTotal + extras).toLocaleString('id-ID')}`
      : undefined,
    'Metode: Konfirmasi via admin',
    '',
    'Peserta:',
    people,
    addonLines ? '' : undefined,
    addonLines ? 'Add-on:' : undefined,
    addonLines || undefined,
    '',
    'Mohon konfirmasi ketersediaan dan cara pembayaran. Terima kasih.',
  ]
    .filter((line) => line !== undefined)
    .join('\n');
}

export function toPayment(input: {
  amount: number;
  method?: OpenTripPaymentMethod;
  note?: string;
}) {
  return {
    amount: input.amount,
    method: input.method ?? OpenTripPaymentMethod.TRANSFER,
    note: input.note?.trim() || undefined,
    paidAt: new Date(),
  };
}
