import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GeoPoint } from './geoPoint.schema';

export type PlaceDocument = Place & Document;

@Schema({
    collection: 'places',
    timestamps: true,
})
export class Place {
    @Prop({ type: String, required: true, trim: true, unique: true, index: true })
    name!: string;

    @Prop({ type: GeoPoint, required: true })
    location!: GeoPoint;

    @Prop({ type: [String], default: [] })
    tags!: string[];
}

export const PlaceSchema = SchemaFactory.createForClass(Place);

PlaceSchema.index({ name: 1 });
