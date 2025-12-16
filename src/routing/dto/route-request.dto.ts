import { IsEnum, IsLatitude, IsLongitude, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum TravelMode {
    DRIVING = 'driving',
    WALKING = 'walking',
    CYCLING = 'cycling',
}

export class RouteRequestDto {
    @IsLatitude()
    @Type(() => Number)
    originLat: number;

    @IsLongitude()
    @Type(() => Number)
    originLon: number;

    @IsLatitude()
    @Type(() => Number)
    destinationLat: number;

    @IsLongitude()
    @Type(() => Number)
    destinationLon: number;

    @IsOptional()
    @IsEnum(TravelMode)
    mode?: TravelMode = TravelMode.DRIVING;
}
