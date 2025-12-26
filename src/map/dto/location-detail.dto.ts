import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDetailDto {
    @ApiProperty({
        description: 'Latitude coordinate',
        minimum: -90,
        maximum: 90,
        example: 48.8584,
    })
    @Type(() => Number)
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
    @Type(() => Number)
    @IsNumber()
    @Min(-180)
    @Max(180)
    lng: number;
}
