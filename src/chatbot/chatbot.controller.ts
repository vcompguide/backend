import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatRequestDto, LocationRecommendationDto } from './dto';

@Controller('chatbot')
export class ChatbotController {
    constructor(private readonly chatbotService: ChatbotService) {}

    // POST chatbot/chat
    @Post('chat')
    async chat(@Body() chatRequestDto: ChatRequestDto) {
        return this.chatbotService.chat(chatRequestDto);
    }

    // POST chatbot/recommendations
    @Post('recommendations')
    async getLocationRecommendations(@Body() locationRecommendationDto: LocationRecommendationDto) {
        return this.chatbotService.getLocationRecommendations(locationRecommendationDto);
    }
}
