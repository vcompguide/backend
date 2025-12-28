import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class NearbySearchDto {
    @ApiProperty({ description: 'Latitude of the center point', example: 37.7749 })
    @IsNumber()
    @Type(() => Number)
    @Min(-90)
    @Max(90)
    latitude: number;

    @ApiProperty({ description: 'Longitude of the center point', example: -122.4194 })
    @IsNumber()
    @Type(() => Number)
    @Min(-180)
    @Max(180)
    longitude: number;

    @ApiProperty({ description: 'Search radius in meters', example: 1000 })
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(50000)
    radius: number;

    @ApiProperty({
        description: 'Array of amenity types to search for',
        example: ['restaurant', 'cafe', 'hospital'],
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsArray()
    @IsString({ each: true })
    amenities?: string[];
}
