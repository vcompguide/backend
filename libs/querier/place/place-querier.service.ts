import { Place } from '@libs/coredb/schemas/place.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { BaseMongoStreamQuerier } from '../base-mongo-stream-querier.service';

export class PlaceQuerierService extends BaseMongoStreamQuerier {
    private allPlace: Place[] = [];

    constructor(
        @InjectModel(Place.name, 'core') private readonly placeModel: Model<Place>,
        scheduler: SchedulerRegistry,
    ) {
        super(scheduler);
    }

    async init() {
        await this.syncFromDatabase();
        this.forceResyncQuerier(
            this.syncFromDatabase.bind(this),
            '0 */5 * * * *', // every 5 minutes
        );
    }

    async syncFromDatabase() {
        this.allPlace = await this.placeModel.find().lean();
    }

    getPlaceFilterByTags(tags?: string[]): Place[] {
        if (!tags || tags.length === 0) {
            return this.allPlace;
        }
        return this.allPlace.filter((place) => place.tags.some((tag) => tags.includes(tag)));
    }
}
