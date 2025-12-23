import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageDto {
    @IsNotEmpty()
    @IsString()
    role: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}

export class ChatRequestDto {
    @IsNotEmpty()
    @IsString()
    message: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    conversationHistory?: MessageDto[];
}
