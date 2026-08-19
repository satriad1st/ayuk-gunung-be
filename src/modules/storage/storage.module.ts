import { Module } from '@nestjs/common';
import { LocalStorageService } from './local-storage.service';
import { STORAGE_SERVICE } from './storage.interface';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController],
  providers: [
    LocalStorageService,
    {
      provide: STORAGE_SERVICE,
      useExisting: LocalStorageService,
    },
  ],
  exports: [LocalStorageService, STORAGE_SERVICE],
})
export class StorageModule {}
