import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Landmark, LandmarkDocument } from './schemas/landmark.schema';

@Injectable()
export class LandmarksService {
    constructor(
        @InjectModel(Landmark.name, 'core')
        private landmarkModel: Model<LandmarkDocument>,
    ) {}

    async findAll(): Promise<LandmarkDocument[]> {
        return this.landmarkModel.find().exec();
    }

    async findOne(id: string): Promise<LandmarkDocument> {
        const landmark = await this.landmarkModel.findById(id).exec();
        if (!landmark) {
            throw new NotFoundException(`Landmark with ID "${id}" not found`);
        }
        return landmark;
    }
}
