import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlaceDocument = Place & Document;

@Schema({ _id: false })
export class GeoPoint {
    @Prop({
        type: Number,
        required: true,
    })
    x!: number;

    @Prop({
        type: Number,
        required: true,
    })
    y!: number;
}

@Schema({
    collection: 'places',
    timestamps: true,
})
export class Place {
    @Prop({ type: String, required: true, trim: true })
    name!: string;

    @Prop({ type: GeoPoint, required: true })
    location!: GeoPoint;

    @Prop({ type: [String], default: [] })
    tags!: string[];
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
