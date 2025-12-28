import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FavoriteDocument = Favorite & Document;

@Schema({
    collection: 'favorites',
    timestamps: true,
})
export class Favorite {
    @Prop({ type: String, required: true, unique: true, index: true })
    userId!: string;

    @Prop({ type: [String], default: [] })
    placeIds!: string[];

    createdAt?: Date;
    updatedAt?: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

// Index for faster queries by userId
FavoriteSchema.index({ userId: 1 });
