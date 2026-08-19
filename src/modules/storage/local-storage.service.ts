import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { StorageService, StoredFile } from './storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
  constructor(private readonly configService: ConfigService) {}

  async save(file: Express.Multer.File, folder: string): Promise<StoredFile> {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const extension = extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${randomUUID()}${extension}`;
    const relativeDir = join(folder, year, month);
    const uploadRoot =
      this.configService.get<string>('upload.dir') ?? 'uploads';
    const absoluteDir = join(process.cwd(), uploadRoot, relativeDir);

    await mkdir(absoluteDir, { recursive: true });
    await writeFile(join(absoluteDir, filename), file.buffer);

    return {
      url: `/${uploadRoot}/${relativeDir.replace(/\\/g, '/')}/${filename}`,
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async remove(url: string): Promise<void> {
    const uploadRoot =
      this.configService.get<string>('upload.dir') ?? 'uploads';
    const prefix = `/${uploadRoot}/`;
    if (!url.startsWith(prefix)) {
      return;
    }

    const absolutePath = join(process.cwd(), url.replace(/^\//, ''));
    await unlink(absolutePath).catch(() => undefined);
  }
}
