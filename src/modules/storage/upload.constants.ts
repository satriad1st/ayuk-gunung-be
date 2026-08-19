import { BadRequestException } from '@nestjs/common';
import { extname } from 'node:path';
import { memoryStorage } from 'multer';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_IMAGE_FOLDERS = new Set([
  'mountains',
  'basecamps',
  'homestays',
  'rooms',
]);

export function resolveImageFolder(folder?: string) {
  const value = folder?.trim() || 'mountains';
  if (!ALLOWED_IMAGE_FOLDERS.has(value)) {
    throw new BadRequestException('Invalid upload folder');
  }
  return value;
}

export const IMAGE_UPLOAD_OPTIONS = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(
        new BadRequestException('Only JPG, PNG, and WEBP images are allowed'),
        false,
      );
      return;
    }

    callback(null, true);
  },
};

export const GPX_UPLOAD_OPTIONS = {
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const extension = extname(file.originalname).toLowerCase();
    if (extension !== '.gpx') {
      callback(new BadRequestException('Only GPX files are allowed'), false);
      return;
    }

    callback(null, true);
  },
};
