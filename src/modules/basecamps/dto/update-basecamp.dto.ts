import { PartialType } from '@nestjs/swagger';
import { CreateBasecampDto } from './create-basecamp.dto';

export class UpdateBasecampDto extends PartialType(CreateBasecampDto) {}
