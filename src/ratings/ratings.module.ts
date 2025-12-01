import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingController } from './ratings.controller';
import { RatingService } from './ratings.service';
import { Rating, RatingSchema } from './schemas/rating.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Rating.name, schema: RatingSchema}]),
    ],
    controllers: [RatingController],
    providers: [RatingService],
    exports: [RatingService],
})
export class RatingModule {}
