import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SaveMessageDto } from './dto/save-message.dto';
import { ChatHistoryResponse } from './response/chat-history.response';
import { MessageResponse } from './response/message.response';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @ApiOperation({ summary: 'Get chat by ID' })
    @ApiResponse({
        status: 200,
        description: 'Chat retrieved successfully',
        type: ChatHistoryResponse,
    })
    @Get('/:chatId')
    getChatById(@Param('chatId') chatId: string) {
        return new ChatHistoryResponse({
            chatHistory: this.chatService.getChatById(chatId),
        });
    }

    @ApiOperation({ summary: 'Save message to database' })
    @ApiResponse({
        status: 200,
        description: 'Chat saved successfully',
        type: MessageResponse,
    })
    @Post('/save')
    async saveMessage(@Body() body: SaveMessageDto) {
        return new MessageResponse(await this.chatService.saveMessage(body));
    }
}
