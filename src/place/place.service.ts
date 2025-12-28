import { Place, PlaceDocument } from '@libs/coredb/schemas/place.schema';
import { PlaceQuerierService } from '@libs/querier/place';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlaceService {
    constructor(
        @InjectModel(Place.name, 'core') private placeModel: Model<PlaceDocument>,
        private placeQuerierService: PlaceQuerierService,
    ) {}

    async createPlace(placeData: Partial<Place>): Promise<Place> {
        const createdPlace = new this.placeModel(placeData);
        return createdPlace.save();
    }

    getPlaceFilterByTags(tags?: string[]): Place[] {
        return this.placeQuerierService.getPlaceFilterByTags(tags);
    }
}
