import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { ChatRequestDto, ImageLocationRequestDto, LocationRecommendationDto } from './dto';
import { ChatResponse, ImageLocationResponse, LocationRecommendationResponse } from './response';

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

    // POST api/chatbot/image-location
    @Post('image-location')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: 'Identify location from image',
        description: 'Upload an image to identify the location and return its information with geo coordinates',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file to analyze',
                },
                additionalContext: {
                    type: 'string',
                    description: 'Optional additional context or question about the image',
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Image analyzed successfully',
        type: ImageLocationResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid image file',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Failed to analyze image',
    })
    async analyzeImageLocation(
        @UploadedFile() file: Express.Multer.File,
        @Body('additionalContext') additionalContext?: string,
    ): Promise<ImageLocationResponse> {
        if (!file) {
            throw new BadRequestException('Image file is required');
        }
        return this.chatbotService.analyzeImageLocation(file, additionalContext);
    }
}
