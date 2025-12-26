import { IsNumber, IsArray, IsEnum, IsOptional, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class Coordinate {
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    lng: number;
}

export class BuildRouteDto {
    @ValidateNested()
    @Type(() => Coordinate)
    origin: Coordinate;

    @ValidateNested()
    @Type(() => Coordinate)
    destination: Coordinate;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Coordinate)
    waypoints?: Coordinate[];

    @IsOptional()
    @IsEnum(['driving', 'walking', 'cycling'])
    mode?: 'driving' | 'walking' | 'cycling' = 'driving';
}
