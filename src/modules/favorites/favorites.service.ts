import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model, Types } from 'mongoose';
import { BasecampsService } from '../basecamps/basecamps.service';
import { HomestaysService } from '../homestays/homestays.service';
import { MountainsService } from '../mountains/mountains.service';
import { FavoriteItemType } from './favorite-item-type';
import { Favorite, FavoriteDocument } from './schemas/favorite.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<FavoriteDocument>,
    private readonly mountainsService: MountainsService,
    private readonly basecampsService: BasecampsService,
    private readonly homestaysService: HomestaysService,
  ) {}

  async listIds(userId: string) {
    const rows = await this.favoriteModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();

    const mountains: string[] = [];
    const basecamps: string[] = [];
    const homestays: string[] = [];

    for (const row of rows) {
      const id = row.itemId.toString();
      if (row.itemType === FavoriteItemType.MOUNTAIN) {
        mountains.push(id);
      } else if (row.itemType === FavoriteItemType.BASECAMP) {
        basecamps.push(id);
      } else {
        homestays.push(id);
      }
    }

    return { mountains, basecamps, homestays };
  }

  async list(userId: string) {
    const ids = await this.listIds(userId);
    const [mountains, basecamps, homestays] = await Promise.all([
      this.mountainsService.findPublicByIds(ids.mountains),
      this.basecampsService.findPublicByIds(ids.basecamps),
      this.homestaysService.findPublicByIds(ids.homestays),
    ]);

    return {
      mountains,
      basecamps,
      homestays,
      total: mountains.length + basecamps.length + homestays.length,
    };
  }

  async toggle(userId: string, itemType: FavoriteItemType, itemId: string) {
    await this.assertItemExists(itemType, itemId);

    const filter = {
      user: new Types.ObjectId(userId),
      itemType,
      itemId: new Types.ObjectId(itemId),
    };

    const existing = await this.favoriteModel.findOne(filter).exec();
    if (existing) {
      await existing.deleteOne();
      return { favorited: false, itemType, itemId };
    }

    try {
      await this.favoriteModel.create(filter);
      return { favorited: true, itemType, itemId };
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        return { favorited: true, itemType, itemId };
      }
      throw error;
    }
  }

  private async assertItemExists(itemType: FavoriteItemType, itemId: string) {
    const found =
      itemType === FavoriteItemType.MOUNTAIN
        ? await this.mountainsService.findPublicByIds([itemId])
        : itemType === FavoriteItemType.BASECAMP
          ? await this.basecampsService.findPublicByIds([itemId])
          : await this.homestaysService.findPublicByIds([itemId]);

    if (found.length === 0) {
      throw new NotFoundException('Item tidak ditemukan');
    }
  }
}
