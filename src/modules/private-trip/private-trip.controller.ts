import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '../../common/constants/permissions';
import { AdminAccess } from '../admin/decorators/admin-access.decorator';
import { PrivateTripResponseDto } from './dto/private-trip-response.dto';
import { UpdatePrivateTripDto } from './dto/update-private-trip.dto';
import { PrivateTripService } from './private-trip.service';

@ApiTags('Private Trip')
@Controller('admin/private-trip')
export class PrivateTripController {
  constructor(private readonly privateTripService: PrivateTripService) {}

  @Get()
  @AdminAccess(Permission.PRIVATE_TRIP_READ)
  @ApiOperation({ summary: 'Get private trip landing content' })
  @ApiOkResponse({ type: PrivateTripResponseDto })
  get() {
    return this.privateTripService.get();
  }

  @Patch()
  @AdminAccess(Permission.PRIVATE_TRIP_UPDATE)
  @ApiOperation({ summary: 'Update private trip landing content' })
  @ApiOkResponse({ type: PrivateTripResponseDto })
  update(@Body() dto: UpdatePrivateTripDto) {
    return this.privateTripService.update(dto);
  }
}
