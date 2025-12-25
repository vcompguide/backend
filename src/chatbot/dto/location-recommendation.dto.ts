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
        example: 'Da Nang',
        type: String,
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    location: string;

    @ApiProperty({
        description: 'Category needed to recommend',
        example: 'restaurants',
        type: String,
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(LocationCategory)
    category: LocationCategory;
}
