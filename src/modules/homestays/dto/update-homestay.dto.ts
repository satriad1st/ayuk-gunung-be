import { PartialType } from '@nestjs/swagger';
import { CreateHomestayDto } from './create-homestay.dto';

export class UpdateHomestayDto extends PartialType(CreateHomestayDto) {}
