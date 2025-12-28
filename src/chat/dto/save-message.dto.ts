import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SaveMessageDto {
    @ApiProperty({ description: 'Unique identifier of the chat', example: 'chat123', required: true, type: String })
    @IsString()
    chatId: string;

    @ApiProperty({ description: 'Unique identifier of the sender', example: 'user123', required: true, type: String })
    @IsString()
    senderId: string;

    @ApiProperty({ description: 'Content of the message', example: 'Hello, world!', required: true, type: String })
    @IsString()
    content: string;
}
