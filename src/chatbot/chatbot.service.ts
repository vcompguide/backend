import { Injectable } from '@nestjs/common';
import { HuggingFaceService } from 'src/external-api/hugging-face.service';
import { ChatRequestDto, LocationRecommendationDto } from './dto';

@Injectable()
export class ChatbotService {
    constructor(private readonly huggingfaceService: HuggingFaceService) {}

    async chat(chatRequestDto: ChatRequestDto) {
        const { message, conversationHistory } = chatRequestDto;
        const mappedHistory = conversationHistory?.map(msg => ({
            role: msg.role,
            content: msg.content,
        }));
        return this.huggingfaceService.chat(message, mappedHistory);
    }

    async getLocationRecommendations(locationRecommendationDto: LocationRecommendationDto) {
        const { location, category } = locationRecommendationDto;
        return this.huggingfaceService.getLocationRecommendations(location, category);
    }
}
