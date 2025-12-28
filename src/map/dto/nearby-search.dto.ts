import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class NearbySearchDto {
    @ApiProperty({
        description: 'Center latitude coordinate for search',
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
        description: 'Center longitude coordinate for search',
        minimum: -180,
        maximum: 180,
        example: 2.2945,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(-180)
    @Max(180)
    lng: number;

    @ApiProperty({
        description: 'Search radius in meters',
        minimum: 100,
        maximum: 10000,
        default: 1000,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(100)
    @Max(10000)
    radius?: number = 1000;

    @ApiProperty({
        description: 'Comma-separated list of amenity types to search for (e.g., restaurant, cafe, hotel)',
        example: 'restaurant,cafe,hotel',
        required: false,
        type: [String],
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',').map((item) => item.trim());
        }
        return value;
    })
    @IsArray()
    @IsString({ each: true })
    amenities?: string[];
}
