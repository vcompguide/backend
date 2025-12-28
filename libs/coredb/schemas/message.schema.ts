import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDocument = Message & Document;

@Schema({
    collection: 'messages',
    timestamps: true,
})
export class Message {
    @Prop({ type: String, required: true })
    chatId!: string;

    @Prop({ type: String, required: true })
    senderId!: string;

    @Prop({ type: String, required: true })
    content!: string;

    createdAt!: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ chatId: 1, createdAt: -1 });
