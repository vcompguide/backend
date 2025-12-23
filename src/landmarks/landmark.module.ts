import { CoreDbModule } from '@libs/coredb';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LandmarksController } from './landmark.controller';
import { LandmarksService } from './landmark.service';
import { Landmark, LandmarkSchema } from './schemas/landmark.schema';

@Module({
    imports: [CoreDbModule, MongooseModule.forFeature([{ name: Landmark.name, schema: LandmarkSchema }], 'core')],
    controllers: [LandmarksController],
    providers: [LandmarksService],
    exports: [LandmarksService],
})
export class LandmarksModule {}
