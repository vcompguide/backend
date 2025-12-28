import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, IsOptional, Max, Min } from 'class-validator';

export class TagsSearchDto {
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
        description: 'Key-value pairs of tags to search for',
        example: { amenity: 'restaurant', cuisine: 'italian' },
    })
    @IsObject()
    tags: Record<string, string>;
}
