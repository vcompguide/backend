import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GeoPoint } from './geoPoint.schema';

@Schema({ _id: false, timestamps: false })
export class Plan {
    @Prop({ type: String, required: true })
    id!: string;

    @Prop({ type: String, required: true })
    title!: string;

    @Prop({ type: String, required: true })
    description!: string;

    @Prop({ type: GeoPoint, required: false })
    location?: GeoPoint;

    @Prop({ type: String, required: true })
    color!: string;

    @Prop({ type: Boolean, required: false })
    finished?: boolean;

    @Prop({ type: Number, required: false })
    startTime?: number;
}

@Schema({ _id: false, timestamps: false })
export class Route {
    @Prop({ type: String, required: true })
    id!: string;

    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String, required: true })
    distance!: string;

    @Prop({ type: String, required: true })
    duration!: string;

    @Prop({ type: [Plan], required: true, default: [] })
    waypointsList!: Plan[];

    @Prop({ type: String, required: true })
    color!: string;
}

export type SavedRouteDocument = SavedRoute & Document;

@Schema({
    collection: 'routes',
    timestamps: true,
})
export class SavedRoute {
    @Prop({ type: String, required: true, unique: true })
    userId!: string;

    @Prop({ type: [Route], required: true, default: [] })
    route!: Route[];
}

export const SavedRouteSchema = SchemaFactory.createForClass(SavedRoute);

SavedRouteSchema.index({ userId: 1 });
