import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, Max, Min, ValidateNested } from 'class-validator';

class Coordinate {
    @ApiProperty({
        description: 'Latitude coordinate',
        minimum: -90,
        maximum: 90,
        example: 48.8584,
    })
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat: number;

    @ApiProperty({
        description: 'Longitude coordinate',
        minimum: -180,
        maximum: 180,
        example: 2.2945,
    })
    @IsNumber()
    @Min(-180)
    @Max(180)
    lng: number;
}

export class BuildRouteDto {
    @ApiProperty({
        description: 'Starting point coordinates',
        type: Coordinate,
    })
    @ValidateNested()
    @Type(() => Coordinate)
    origin: Coordinate;

    @ApiProperty({
        description: 'Destination point coordinates',
        type: Coordinate,
    })
    @ValidateNested()
    @Type(() => Coordinate)
    destination: Coordinate;

    @ApiProperty({
        description: 'Optional intermediate waypoints',
        type: [Coordinate],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Coordinate)
    waypoints?: Coordinate[];

    @ApiProperty({
        description: 'Travel mode for routing',
        enum: ['driving', 'walking', 'cycling'],
        default: 'driving',
        required: false,
    })
    @IsOptional()
    @IsEnum(['driving', 'walking', 'cycling'])
    mode?: 'driving' | 'walking' | 'cycling' = 'driving';
}
