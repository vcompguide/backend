import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type LandmarkDocument = mongoose.HydratedDocument<Landmark>;

@Schema()
export class LandmarkLocation {
    @Prop({ type: String, enum: ['Point'], default: 'Point' })
    type: string;

    // [longitude, latitude] format
    @Prop({ type: [Number], required: true })
    coordinates: number[];
}

@Schema({ timestamps: true })
export class Landmark {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: LandmarkLocation })
    location: LandmarkLocation;

    @Prop({ required: true, default: 0 })
    avgRating: number;

    @Prop({ required: true })
    raw_data: string;
}

export const LandmarkSchema = SchemaFactory.createForClass(Landmark);
LandmarkSchema.index({ location: '2dsphere' });
