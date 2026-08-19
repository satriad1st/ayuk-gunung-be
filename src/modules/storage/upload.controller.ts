import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../admin/guards/admin-jwt-auth.guard';
import { LocalStorageService } from './local-storage.service';
import {
  GPX_UPLOAD_OPTIONS,
  IMAGE_UPLOAD_OPTIONS,
  resolveImageFolder,
} from './upload.constants';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard)
@Controller('admin/uploads')
export class UploadController {
  constructor(private readonly storageService: LocalStorageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 8, IMAGE_UPLOAD_OPTIONS))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload images to local storage' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    const target = resolveImageFolder(folder);
    const uploaded = await Promise.all(
      (files ?? []).map((file) => this.storageService.save(file, target)),
    );

    return { data: uploaded };
  }

  @Post('gpx')
  @UseInterceptors(FileInterceptor('file', GPX_UPLOAD_OPTIONS))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a GPX track file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadGpx(@UploadedFile() file: Express.Multer.File) {
    const uploaded = await this.storageService.save(file, 'gpx');
    return { data: uploaded };
  }
}
