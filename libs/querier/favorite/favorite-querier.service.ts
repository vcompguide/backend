import { Favorite } from '@libs/coredb/schemas/favorite.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { BaseMongoStreamQuerier } from '../base-mongo-stream-querier.service';

export class FavoriteQuerierService extends BaseMongoStreamQuerier {
    private allFavorites: Favorite[] = [];

    constructor(
        @InjectModel(Favorite.name, 'core') private readonly favoriteModel: Model<Favorite>,
        scheduler: SchedulerRegistry,
    ) {
        super(scheduler);
    }

    async init() {
        await this.syncFromDatabase();
        this.forceResyncQuerier(
            this.syncFromDatabase.bind(this),
            '0 */1 * * * *', // every 1 minute
        );
    }

    async syncFromDatabase() {
        this.allFavorites = await this.favoriteModel.find().lean();
    }

    // Get favorite place IDs for a specific user
    getFavoritesByUserId(userId: string): string[] {
        const favorite = this.allFavorites.find((fav) => fav.userId === userId);
        return favorite?.placeIds || [];
    }

    // Check if a place is in user's favorites
    isPlaceInFavorites(userId: string, placeId: string): boolean {
        const favorite = this.allFavorites.find((fav) => fav.userId === userId);
        return favorite?.placeIds.includes(placeId) || false;
    }

    // Get all users who favorited a specific place
    getUsersWhoFavoritedPlace(placeId: string): string[] {
        return this.allFavorites.filter((fav) => fav.placeIds.includes(placeId)).map((fav) => fav.userId);
    }

    // Get favorite count for a user
    getFavoriteCount(userId: string): number {
        const favorite = this.allFavorites.find((fav) => fav.userId === userId);
        return favorite?.placeIds.length || 0;
    }

    // Get all favorites (for admin purposes)
    getAllFavorites(): Favorite[] {
        return this.allFavorites;
    }

    getFavoriteStats(): {
        totalUsers: number;
        totalFavorites: number;
        averageFavoritesPerUser: number;
    } {
        const totalUsers = this.allFavorites.length;
        const totalFavorites = this.allFavorites.reduce((sum, fav) => sum + fav.placeIds.length, 0);
        const averageFavoritesPerUser = totalUsers > 0 ? totalFavorites / totalUsers : 0;

        return {
            totalUsers,
            totalFavorites,
            averageFavoritesPerUser: Math.round(averageFavoritesPerUser * 100) / 100,
        };
    }
}
