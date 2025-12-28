import { OmitMethod } from '@libs/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { MessageResponse } from './message.response';

export class ChatHistoryResponse {
    @ApiProperty({
        description: 'Chat history messages',
        type: MessageResponse,
        isArray: true,
    })
    chatHistory: MessageResponse[];

    constructor(data: OmitMethod<ChatHistoryResponse>) {
        this.chatHistory = data.chatHistory.map((message) => new MessageResponse(message));
    }
}
