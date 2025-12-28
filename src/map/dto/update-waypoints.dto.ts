import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, Max, Min, ValidateNested } from 'class-validator';

class WaypointCoordinate {
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

export class UpdateWaypointsDto {
    @ApiProperty({
        description: 'Array of waypoint coordinates',
        type: [WaypointCoordinate],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WaypointCoordinate)
    waypoints: WaypointCoordinate[];
}
