import { Prop, Schema } from '@nestjs/mongoose';

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
