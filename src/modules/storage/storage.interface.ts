export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export interface StoredFile {
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface StorageService {
  save(file: Express.Multer.File, folder: string): Promise<StoredFile>;
  remove(url: string): Promise<void>;
}
