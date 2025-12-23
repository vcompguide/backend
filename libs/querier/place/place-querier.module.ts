import { SchedulerModule } from '@libs/common/scheduler/scheduler.module';
import { CoreDbModule } from '@libs/coredb';
import { Place, PlaceSchema } from '@libs/coredb/schemas/place.schema';
import { Global, Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { PlaceQuerierService } from './place-querier.service';

@Global()
@Module({})
export class PlaceQuerierModule {
    static forRoot() {
        return {
            module: PlaceQuerierModule,
            imports: [
                CoreDbModule,
                MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }], 'core'),
                SchedulerModule,
            ],
            providers: [
                {
                    provide: PlaceQuerierService,
                    useFactory: async (placeModel: Model<Place>, scheduler: SchedulerRegistry) => {
                        const service = new PlaceQuerierService(placeModel, scheduler);
                        await service.init();
                        return service;
                    },
                    inject: [getModelToken(Place.name, 'core'), SchedulerRegistry],
                },
            ],
            exports: [PlaceQuerierService],
        };
    }
}
