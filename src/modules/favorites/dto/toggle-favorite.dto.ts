import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId } from 'class-validator';
import { FavoriteItemType } from '../favorite-item-type';

export class ToggleFavoriteDto {
  @ApiProperty({ enum: FavoriteItemType, example: FavoriteItemType.MOUNTAIN })
  @IsEnum(FavoriteItemType)
  itemType: FavoriteItemType;

  @ApiProperty({ example: '66c0f0a1b2c3d4e5f6789012' })
  @IsMongoId()
  itemId: string;
}
