import { IsNumber, IsOptional, IsArray, Min, Max, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CoordinatePair {
  @ApiProperty({ description: 'Latitude', example: 37.7749 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: -122.4194 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class BulkNearbySearchDto {
  @ApiProperty({
    description: 'Array of coordinate pairs to search from',
    example: [
      { latitude: 37.7749, longitude: -122.4194 },
      { latitude: 40.7128, longitude: -74.0060 }
    ],
    type: [CoordinatePair]
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CoordinatePair)
  coordinates: CoordinatePair[];

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
