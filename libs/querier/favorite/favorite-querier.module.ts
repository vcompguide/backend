import { SchedulerModule } from '@libs/common/scheduler/scheduler.module';
import { CoreDbModule } from '@libs/coredb';
import { Favorite, FavoriteSchema } from '@libs/coredb/schemas/favorite.schema';
import { Global, Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { FavoriteQuerierService } from './favorite-querier.service';

@Global()
@Module({})
export class FavoriteQuerierModule {
    static forRoot() {
        return {
            module: FavoriteQuerierModule,
            imports: [
                CoreDbModule,
                MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }], 'core'),
                SchedulerModule,
            ],
            providers: [
                {
                    provide: FavoriteQuerierService,
                    useFactory: async (favoriteModel: Model<Favorite>, scheduler: SchedulerRegistry) => {
                        const service = new FavoriteQuerierService(favoriteModel, scheduler);
                        await service.init();
                        return service;
                    },
                    inject: [getModelToken(Favorite.name, 'core'), SchedulerRegistry],
                },
            ],
            exports: [FavoriteQuerierService],
        };
    }
}
