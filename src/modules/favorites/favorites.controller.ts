import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  FavoriteIdsResponseDto,
  ToggleFavoriteResponseDto,
} from './dto/favorite-response.dto';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'List the current user favorites with catalog data' })
  list(@CurrentUser() user: AuthUser) {
    return this.favoritesService.list(user.id);
  }

  @Get('ids')
  @ApiOperation({ summary: 'List favorite item IDs for UI state' })
  @ApiOkResponse({ type: FavoriteIdsResponseDto })
  listIds(@CurrentUser() user: AuthUser) {
    return this.favoritesService.listIds(user.id);
  }

  @Post('toggle')
  @ApiOperation({ summary: 'Add or remove a favorite' })
  @ApiOkResponse({ type: ToggleFavoriteResponseDto })
  toggle(@CurrentUser() user: AuthUser, @Body() dto: ToggleFavoriteDto) {
    return this.favoritesService.toggle(user.id, dto.itemType, dto.itemId);
  }
}
