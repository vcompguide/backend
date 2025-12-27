import { ApiProperty } from '@nestjs/swagger';
import { MapLocation } from './map-location.interface';

export class SearchPlaceResponse {
    @ApiProperty({
        description: 'Indicates if the search was successful',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'Array of found locations',
        type: [MapLocation],
    })
    data: MapLocation[];

    @ApiProperty({
        description: 'Number of results returned',
        example: 5,
    })
    count: number;
}
