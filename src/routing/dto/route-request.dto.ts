import { IsEnum, IsLatitude, IsLongitude, IsOptional, ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum TravelMode {
    DRIVING = 'driving',
    WALKING = 'walking',
    CYCLING = 'cycling',
}

export class CoordinateDto {
    @ApiProperty({
        description: 'Latitude of the coordination',
        type: Number,
        example: 10.762622,
        required: true,
    })
    @IsLatitude()
    @Type(() => Number)
    lat: number;

    @ApiProperty({
        description: 'Longitude of the coordination',
        type: Number,
        example: 106.660172,
        required: true,
    })
    @IsLongitude()
    @Type(() => Number)
    lon: number;
}

export class RouteRequestDto {
    @ApiProperty({
        description: 'List of coordinations in the route',
        type: Array,
        example: [
            {
                lat: 10.762622,
                lon: 106.660172
            },
            {
                lat: 10.782622,
                lon: 106.680172
            }
        ],
        required: true,
    })
    @IsArray()
    @ArrayMinSize(2, { message: 'At least two points are required' })
    @ValidateNested({ each: true })
    @Type(() => CoordinateDto)
    waypoints: CoordinateDto[];

    @ApiProperty({
        description: 'Vehicle mode to find the suitable route',
        type: String,
        enum: TravelMode,
        default: TravelMode.DRIVING,
        example: 'walking',
        required: false,
    })
    @IsOptional()
    @IsEnum(TravelMode)
    mode?: TravelMode = TravelMode.DRIVING;
}
