import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class BoundingBoxSearchDto {
    @ApiProperty({ description: 'South latitude of bounding box', example: 37.7 })
    @IsNumber()
    @Type(() => Number)
    @Min(-90)
    @Max(90)
    south: number;

    @ApiProperty({ description: 'West longitude of bounding box', example: -122.5 })
    @IsNumber()
    @Type(() => Number)
    @Min(-180)
    @Max(180)
    west: number;

    @ApiProperty({ description: 'North latitude of bounding box', example: 37.8 })
    @IsNumber()
    @Type(() => Number)
    @Min(-90)
    @Max(90)
    north: number;

    @ApiProperty({ description: 'East longitude of bounding box', example: -122.3 })
    @IsNumber()
    @Type(() => Number)
    @Min(-180)
    @Max(180)
    east: number;

    @ApiProperty({
        description: 'Array of tag values to search for (e.g., restaurant, hotel, museum)',
        example: ['restaurant', 'cafe', 'hospital'],
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsArray()
    @IsString({ each: true })
    amenities?: string[];

    @ApiProperty({
        description: 'OSM tag key to search (e.g., "tourism", "amenity", "historic", "leisure", "shop")',
        example: 'amenity',
        required: false,
        default: 'amenity',
    })
    @IsOptional()
    @IsString()
    tagKey?: string = 'amenity';
}
