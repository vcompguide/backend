import { Injectable } from '@nestjs/common';
import { HuggingFaceService } from '../external-api/hugging-face.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ChatRequestDto, LocationRecommendationDto } from './dto';
import { ChatResponse, ImageLocationResponse, LocationRecommendationResponse } from './response';

@Injectable()
export class ChatbotService {
    constructor(
        private readonly huggingfaceService: HuggingFaceService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

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

    async analyzeImageLocation(
        file: Express.Multer.File,
        additionalContext?: string
    ): Promise<ImageLocationResponse> {
        // Upload image to Cloudinary to get a URL
        const uploadResult = await this.cloudinaryService.uploadImage(file, 'image-analysis');
        const imageURL = uploadResult.secure_url;
        const publicId = uploadResult.public_id;

        try {
            const result = await this.huggingfaceService.analyzeImageLocation(imageURL, additionalContext);

            // Optionally delete from Cloudinary after analysis
            // await this.cloudinaryService.deleteImage(publicId);

            return new ImageLocationResponse(result);
        } catch (error) {
            await this.cloudinaryService.deleteImage(publicId);
            throw error;
        }
    }
}
