import { SchedulerModule } from '@libs/common/scheduler/scheduler.module';
import { CoreDbModule } from '@libs/coredb';
import { Place, PlaceSchema } from '@libs/coredb/schemas/place.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceQuerierService } from './place-querier.service';

@Module({
    imports: [
        CoreDbModule,
        MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }], 'core'),
        SchedulerModule,
    ],
    providers: [PlaceQuerierService],
    exports: [PlaceQuerierService],
})
export class PlaceQuerierModule {}
