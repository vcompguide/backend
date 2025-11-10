import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LandmarksController } from './landmark.controller';
import { LandmarksService } from './landmark.service';
import { Landmark, LandmarkSchema } from './schemas/landmark.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Landmark.name, schema: LandmarkSchema},
        ]),
    ],
    controllers: [LandmarksController],
    providers: [LandmarksService],
    exports: [
        LandmarksService,
        MongooseModule.forFeature([
            {name: Landmark.name, schema: LandmarkSchema},
        ]),
    ],
})
export class LandmarksModule {}
