import { OmitMethod } from '@libs/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class ChatResponse {
    @ApiProperty({
        description: 'Indicates whether the request was successful',
        type: Boolean,
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: "The chatbot's response message",
        type: String,
        example: 'Da Nang City is a vibrant destination...',
    })
    response: string;

    @ApiProperty({
        description: 'The AI model used to generate the response',
        type: String,
        example: 'meta-llama/Llama-3.2-3B-Instruct',
    })
    model: string;

    constructor(data: OmitMethod<ChatResponse>) {
        this.success = data.success;
        this.response = data.response;
        this.model = data.model;
    }
}

export class LocationRecommendationResponse {
    @ApiProperty({
        description: 'Indicates whether the request was successful',
        type: Boolean,
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: "The chatbot's recommendations for the specified location and category",
        type: String,
        example: '1. Olivia\'s Prime Steakhouse - A michelin restaurant...',
    })
    response: string;

    @ApiProperty({
        description: 'The AI model used to generate the recommendations',
        type: String,
        example: 'meta-llama/Llama-3.2-3B-Instruct',
    })
    model: string;

    constructor(data: OmitMethod<LocationRecommendationResponse>) {
        this.success = data.success;
        this.response = data.response;
        this.model = data.model;
    }
}
