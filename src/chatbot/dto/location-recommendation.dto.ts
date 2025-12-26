import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum LocationCategory {
    ACTIVITIES = 'activities',
    ATTRACTIONS = 'attractions',
    HOTELS = 'hotels',
    RESTAURANTS = 'restaurants',
}

export class LocationRecommendationDto {
    @ApiProperty({
        description: 'Name of the location',
        type: String,
        example: 'Da Nang',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    location: string;

    @ApiProperty({
        description: 'Category needed to recommend',
        type: String,
        enum: LocationCategory,
        example: 'restaurants',
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(LocationCategory)
    category: LocationCategory;
}
