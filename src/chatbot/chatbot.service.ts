import { Injectable } from '@nestjs/common';
import { HuggingFaceService } from 'src/external-api/hugging-face.service';
import { ChatRequestDto, LocationRecommendationDto } from './dto';
import { ChatResponse, LocationRecommendationResponse } from './response';

@Injectable()
export class ChatbotService {
    constructor(private readonly huggingfaceService: HuggingFaceService) {}

    async chat(chatRequestDto: ChatRequestDto): Promise<ChatResponse> {
        const { message, conversationHistory } = chatRequestDto;
        const mappedHistory = conversationHistory?.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));
        const result = await this.huggingfaceService.chat(message, mappedHistory);
        return new ChatResponse(result);
    }

    async getLocationRecommendations(
        locationRecommendationDto: LocationRecommendationDto,
    ): Promise<LocationRecommendationResponse> {
        const { location, category } = locationRecommendationDto;
        const result = await this.huggingfaceService.getLocationRecommendations(location, category);
        return new LocationRecommendationResponse(result);
    }
}
