import { ApiProperty } from '@nestjs/swagger';
import { FavoriteItemType } from '../favorite-item-type';

export class ToggleFavoriteResponseDto {
  @ApiProperty()
  favorited: boolean;

  @ApiProperty({ enum: FavoriteItemType })
  itemType: FavoriteItemType;

  @ApiProperty()
  itemId: string;
}

export class FavoriteIdsResponseDto {
  @ApiProperty({ type: [String] })
  mountains: string[];

  @ApiProperty({ type: [String] })
  basecamps: string[];

  @ApiProperty({ type: [String] })
  homestays: string[];
}
