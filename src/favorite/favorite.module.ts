import { Favorite, FavoriteSchema } from '@libs/coredb/schemas/favorite.schema';
import { FavoriteQuerierModule } from '@libs/querier/favorite/favorite-querier.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }], 'core'),
        FavoriteQuerierModule.forRoot(),
    ],
    controllers: [FavoriteController],
    providers: [FavoriteService],
    exports: [FavoriteService],
})
export class FavoriteModule {}
