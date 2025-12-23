import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum LocationCategory {
    ATTRACTIONS = 'attractions',
    RESTAURANTS = 'restaurants',
    HOTELS = 'hotels',
    ACTIVITIES = 'activities',
}

export class LocationRecommendationDto {
    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsEnum(LocationCategory)
    category: LocationCategory;
}
