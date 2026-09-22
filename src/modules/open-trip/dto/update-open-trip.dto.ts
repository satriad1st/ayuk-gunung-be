import { PartialType } from '@nestjs/swagger';
import { CreateOpenTripDto } from './create-open-trip.dto';

export class UpdateOpenTripDto extends PartialType(CreateOpenTripDto) {}
