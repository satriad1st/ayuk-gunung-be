import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from '../../common/constants/permissions';
import type { AdminAuthUser } from '../../common/interfaces/auth-admin.interface';
import { AdminAccess } from '../admin/decorators/admin-access.decorator';
import { CurrentAdmin } from '../admin/decorators/current-admin.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomResponseDto } from './dto/homestay-response.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { HomestaysService } from './homestays.service';

@ApiTags('Homestay Rooms')
@Controller('admin/homestays/:homestayId/rooms')
export class RoomsController {
  constructor(private readonly homestaysService: HomestaysService) {}

  @Post()
  @AdminAccess(Permission.HOMESTAY_UPDATE)
  @ApiOperation({ summary: 'Create a room under a homestay' })
  @ApiCreatedResponse({ type: RoomResponseDto })
  create(
    @Param('homestayId') homestayId: string,
    @Body() dto: CreateRoomDto,
    @CurrentAdmin() actor: AdminAuthUser,
  ) {
    return this.homestaysService.createRoom(homestayId, dto, actor);
  }

  @Get()
  @AdminAccess(Permission.HOMESTAY_READ)
  @ApiOperation({ summary: 'List rooms of a homestay' })
  @ApiOkResponse({ type: [RoomResponseDto] })
  findAll(
    @Param('homestayId') homestayId: string,
    @CurrentAdmin() actor: AdminAuthUser,
  ) {
    return this.homestaysService.findRooms(homestayId, actor);
  }

  @Patch(':roomId')
  @AdminAccess(Permission.HOMESTAY_UPDATE)
  @ApiOperation({ summary: 'Update a room' })
  @ApiOkResponse({ type: RoomResponseDto })
  update(
    @Param('homestayId') homestayId: string,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateRoomDto,
    @CurrentAdmin() actor: AdminAuthUser,
  ) {
    return this.homestaysService.updateRoom(homestayId, roomId, dto, actor);
  }

  @Delete(':roomId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminAccess(Permission.HOMESTAY_UPDATE)
  @ApiOperation({ summary: 'Delete a room' })
  @ApiNoContentResponse()
  remove(
    @Param('homestayId') homestayId: string,
    @Param('roomId') roomId: string,
    @CurrentAdmin() actor: AdminAuthUser,
  ) {
    return this.homestaysService.removeRoom(homestayId, roomId, actor);
  }
}
