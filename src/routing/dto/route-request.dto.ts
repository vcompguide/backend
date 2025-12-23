import { IsEnum, IsLatitude, IsLongitude, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export enum TravelMode {
    DRIVING = 'driving',
    WALKING = 'walking',
    CYCLING = 'cycling',
}

export class CoordinateDto {
    @IsLatitude()
    @Type(() => Number)
    lat: number;

    @IsLongitude()
    @Type(() => Number)
    lon: number;
}

export class RouteRequestDto {
    @ArrayMinSize(2, { message: 'At least two waypoints are required' })
    @ValidateNested({ each: true })
    @Type(() => CoordinateDto)
    waypoints: CoordinateDto[];

    @IsOptional()
    @IsEnum(TravelMode)
    mode?: TravelMode = TravelMode.DRIVING;
}
