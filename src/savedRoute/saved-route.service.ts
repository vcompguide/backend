import { SavedRoute, SavedRouteDocument } from '@libs/coredb/schemas/route.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSavedRouteDto } from './dto/create-saved-route.dto';

@Injectable()
export class SavedRouteService {
    constructor(@InjectModel(SavedRoute.name, 'core') private savedRouteModel: Model<SavedRoute>) {}

    async createSavedRoute(savedRouteDto: CreateSavedRouteDto): Promise<SavedRoute> {
        await this.savedRouteModel.findOneAndDelete({ userId: savedRouteDto.userId }).exec();
        const createdSavedRoute = new this.savedRouteModel(savedRouteDto);
        return createdSavedRoute.save();
    }

    async getSavedRoutesByUserId(userId: string) {
        return this.savedRouteModel.findOne({ userId }).lean();
    }
}
