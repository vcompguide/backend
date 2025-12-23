import { User } from '@libs/coredb/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Landmark } from 'src/landmarks/schemas/landmark.schema';

export type RatingDocument = mongoose.HydratedDocument<Rating>;

@Schema({ timestamps: true })
export class Rating {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    })
    user: User;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Landmark',
        required: true,
        index: true,
    })
    landmark: Landmark;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ required: false, default: '' })
    reviewText: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
RatingSchema.index({ user: 1, landmark: 1 }, { unique: true });
