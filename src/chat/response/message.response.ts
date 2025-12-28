import { OmitMethod } from '@libs/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
    @ApiProperty({
        description: 'Unique indentifier of the chat',
        type: String,
    })
    chatId: string;

    @ApiProperty({
        description: 'Unique identifier of the sender',
        type: String,
    })
    senderId: string;

    @ApiProperty({
        description: 'Content of the message',
        type: String,
    })
    content: string;

    @ApiProperty({
        description: 'Timestamp when the message was created',
        type: String,
        format: 'date-time',
    })
    createdAt: Date;

    constructor(data: OmitMethod<MessageResponse>) {
        this.chatId = data.chatId;
        this.senderId = data.senderId;
        this.content = data.content;
        this.createdAt = data.createdAt;
    }
}
