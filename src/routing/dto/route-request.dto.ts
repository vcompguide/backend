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
    @ArrayMinSize(2, { message: 'Cần ít nhất 2 điểm (điểm đầu và điểm cuối) để tìm đường.' })
    @ValidateNested({ each: true })
    @Type(() => CoordinateDto)
    waypoints: CoordinateDto[];

    @IsOptional()
    @IsEnum(TravelMode)
    mode?: TravelMode = TravelMode.DRIVING;
}
