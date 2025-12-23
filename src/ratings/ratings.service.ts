import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating, RatingDocument } from './schemas/rating.schema';

@Injectable()
export class RatingService {
    constructor(
        @InjectModel(Rating.name, 'core')
        private landmarkModel: Model<RatingDocument>,
    ) {}
}
