import { ApiProperty } from '@nestjs/swagger';
import { OmitMethod } from '@libs/common/types';

export class LocationCoordinates {
    @ApiProperty({
        description: 'Latitude of the location',
        type: Number,
        example: 10.762622,
    })
    lat: number;

    @ApiProperty({
        description: 'Longitude of the location',
        type: Number,
        example: 106.660172,
    })
    lon: number;
}

export class ImageLocationResponse {
    @ApiProperty({
        description: 'Indicates whether the request was successful',
        type: Boolean,
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'Name or description of the identified location',
        type: String,
        example: 'Notre-Dame Cathedral Basilica of Saigon',
    })
    locationName: string;

    @ApiProperty({
        description: 'Detailed information about the location',
        type: String,
        example:
            'The Notre-Dame Cathedral Basilica of Saigon is a Roman Catholic cathedral located in Ho Chi Minh City, Vietnam...',
    })
    description: string;

    @ApiProperty({
        description: 'Geographical coordinates of the location',
        type: LocationCoordinates,
        required: false,
    })
    coordinates?: LocationCoordinates;

    @ApiProperty({
        description: 'The AI model used to analyze the image',
        type: String,
        example: 'meta-llama/Llama-3.2-11B-Vision-Instruct',
    })
    model: string;

    @ApiProperty({
        description: 'URL of the uploaded image on Cloudinary',
        type: String,
        example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/image-analysis/abc123.jpg',
        required: false,
    })
    imageUrl?: string;

    constructor(data: OmitMethod<ImageLocationResponse>) {
        this.success = data.success;
        this.locationName = data.locationName;
        this.description = data.description;
        this.coordinates = data.coordinates;
        this.model = data.model;
        this.imageUrl = data.imageUrl;
    }
}
