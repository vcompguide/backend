import { CoreDbModule } from '@libs/coredb';
import { SavedRoute, SavedRouteSchema } from '@libs/coredb/schemas/route.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedRouteController } from './saved-route.controller';
import { SavedRouteService } from './saved-route.service';

@Module({
    imports: [
        CoreDbModule,
        MongooseModule.forFeature(
            [
                {
                    name: SavedRoute.name,
                    schema: SavedRouteSchema,
                },
            ],
            'core',
        ),
    ],
    controllers: [SavedRouteController],
    providers: [SavedRouteService],
})
export class SavedRouteModule {}
