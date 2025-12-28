import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class MessageDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['chatbot', 'system', 'user'])
    role: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}

export class ChatRequestDto {
    @ApiProperty({
        description: 'Message from user',
        type: String,
        example: 'message',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiProperty({
        description: 'The conversation history including messages from chatbot and user',
        type: [MessageDto],
        example: [
            {
                role: 'chatbot',
                content: 'Hello user, I am chatbot.',
            },
            {
                role: 'user',
                content: 'Hello chatbot, I am user.',
            },
        ],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    conversationHistory?: MessageDto[];
}
