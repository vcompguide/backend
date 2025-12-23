import { CoreDbModule } from '@libs/coredb';
import { Place, PlaceSchema } from '@libs/coredb/schemas/place.schema';
import { PlaceQuerierModule } from '@libs/querier/place';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
    imports: [
        CoreDbModule,
        PlaceQuerierModule,
        MongooseModule.forFeature(
            [
                {
                    name: Place.name,
                    schema: PlaceSchema,
                },
            ],
            'core',
        ),
    ],
    controllers: [PlaceController],
    providers: [PlaceService],
})
export class PlaceModule {}
