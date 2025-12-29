import { Favorite, FavoriteDocument } from '@libs/coredb/schemas/favorite.schema';
import { FavoriteQuerierService } from '@libs/querier/favorite/favorite-querier.service';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateFavoritesDto } from './dto/index';
import { FavoriteIdsResponse, UpdateFavoriteResponse } from './response/index';

@Injectable()
export class FavoriteService {
    private readonly logger = new Logger(FavoriteService.name);

    constructor(
        @InjectModel(Favorite.name, 'core')
        private favoriteModel: Model<FavoriteDocument>,
        private readonly favoriteQuerier: FavoriteQuerierService,
    ) {}

    /**
     * Query operation: Get favorite place IDs for a user
     */
    async getFavoriteIds(userId: string): Promise<FavoriteIdsResponse> {
        // Use querier for fast read
        const placeIds = this.favoriteQuerier.getFavoritesByUserId(userId);

        return new FavoriteIdsResponse({
            success: true,
            placeIds: placeIds,
            total: placeIds.length,
        });
    }

    /**
     * Write operation: Update (replace) all favorites for a user
     */
    async updateFavorites(updateFavoritesDto: UpdateFavoritesDto): Promise<UpdateFavoriteResponse> {
        await this.favoriteModel.findOneAndDelete({ userId: updateFavoritesDto.userId }).exec();

        const result = await new this.favoriteModel(updateFavoritesDto).save();

        return new UpdateFavoriteResponse({
            success: true,
            message: 'Favorites saved successfully',
            count: result.placeIds.length,
        });
    }
}
