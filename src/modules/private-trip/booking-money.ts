import { PaymentStatus } from './schemas/private-trip-booking.schema';

export function addDaysYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function moneyTotals(input: {
  pax: number;
  pricePerPerson: number;
  discount?: number | null;
  paidAmount?: number;
}) {
  const subtotal = Math.round(input.pax * input.pricePerPerson);
  const discount = Math.round(input.discount ?? 0);
  const finalPrice = Math.max(0, subtotal - discount);
  const paidAmount = Math.round(input.paidAmount ?? 0);
  const remainingAmount = Math.max(0, finalPrice - paidAmount);
  const paymentStatus =
    remainingAmount <= 0
      ? PaymentStatus.PAID
      : paidAmount <= 0
        ? PaymentStatus.UNPAID
        : PaymentStatus.PARTIAL;

  return {
    subtotal,
    discount,
    finalPrice,
    paidAmount,
    remainingAmount,
    paymentStatus,
  };
}
