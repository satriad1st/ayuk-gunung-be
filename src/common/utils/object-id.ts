import { Types } from 'mongoose';

export function toObjectId(id: string) {
  return new Types.ObjectId(id);
}

/** Match refs stored as ObjectId or as a 24-char string (legacy create). */
export function objectIdFilter(id: string) {
  return { $in: [new Types.ObjectId(id), id] };
}
