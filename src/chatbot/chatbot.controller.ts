import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { ChatRequestDto, LocationRecommendationDto } from './dto';
import { ChatResponse, LocationRecommendationResponse } from './response';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
    constructor(private readonly chatbotService: ChatbotService) {}

    // POST api/chatbot/chat
    @Post('chat')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get response message from the chatbot',
        description: "Get response from HuggingFace model for user's request message",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Chatbot responded successfully',
        type: ChatResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Failed to get response from Hugging Face service',
    })
    async chat(@Body() chatRequestDto: ChatRequestDto): Promise<ChatResponse> {
        return this.chatbotService.chat(chatRequestDto);
    }

    // POST api/chatbot/recommendations
    @Post('recommendations')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get recommendations from the chatbot',
        description: 'Get recommendations from HuggingFace model for a specific category requested by user',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Chatbot responded successfully',
        type: LocationRecommendationResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid location or category',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Failed to get recommendations from Hugging Face service',
    })
    async getLocationRecommendations(
        @Body() locationRecommendationDto: LocationRecommendationDto,
    ): Promise<LocationRecommendationResponse> {
        return this.chatbotService.getLocationRecommendations(locationRecommendationDto);
    }
}
