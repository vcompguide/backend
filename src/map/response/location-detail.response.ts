import { ApiProperty } from '@nestjs/swagger';

class Coordinate {
    @ApiProperty({ description: 'Latitude coordinate', example: 48.8584 })
    lat: number;

    @ApiProperty({ description: 'Longitude coordinate', example: 2.2945 })
    lng: number;
}

class NearbyPlace {
    @ApiProperty({ description: 'Place identifier', example: '123456' })
    id: string | number;

    @ApiProperty({ description: 'Place name', example: 'Cafe Paris' })
    name: string;

    @ApiProperty({ description: 'Latitude coordinate', example: 48.8584 })
    lat: number;

    @ApiProperty({ description: 'Longitude coordinate', example: 2.2945 })
    lng: number;

    @ApiProperty({ description: 'Place type', example: 'cafe' })
    type: string;

    @ApiProperty({ description: 'Additional place tags', required: false, example: { cuisine: 'french' } })
    tags?: Record<string, any>;
}

class LocationData {
    @ApiProperty({ description: 'Location coordinates', type: Coordinate })
    coordinate: Coordinate;

    @ApiProperty({
        description: 'Full address of the location',
        example: '5 Avenue Anatole France, 75007 Paris, France',
    })
    address: string;

    @ApiProperty({
        description: 'Nearby places categorized by type',
        example: {
            restaurant: [{ id: '123', name: 'Restaurant A', lat: 48.8584, lng: 2.2945, type: 'restaurant' }],
            cafe: [{ id: '456', name: 'Cafe B', lat: 48.8585, lng: 2.2946, type: 'cafe' }],
        },
    })
    nearby: { [category: string]: NearbyPlace[] };

    @ApiProperty({ description: 'Type of location', required: false, example: 'tourist_attraction' })
    locationType?: string;
}

export class LocationDetailResponse {
    @ApiProperty({ description: 'Indicates if the request was successful', example: true })
    success: boolean;

    @ApiProperty({ description: 'Location details and nearby places', type: LocationData })
    data: LocationData;
}
