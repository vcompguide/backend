import { IsArray, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class WaypointCoordinate {
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    lng: number;
}

export class UpdateWaypointsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WaypointCoordinate)
    waypoints: WaypointCoordinate[];
}
