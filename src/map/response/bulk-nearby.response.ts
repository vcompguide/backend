import { ApiProperty } from '@nestjs/swagger';

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

    @ApiProperty({
        description: 'Additional place tags',
        required: false,
        example: { cuisine: 'french', outdoor_seating: 'yes' },
    })
    tags?: Record<string, any>;
}

class LocationNearbyData {
    @ApiProperty({ description: 'Search center latitude', example: 48.8584 })
    latitude: number;

    @ApiProperty({ description: 'Search center longitude', example: 2.2945 })
    longitude: number;

    @ApiProperty({
        description: 'Nearby places categorized by amenity type',
        example: {
            restaurant: [{ id: '123', name: 'Restaurant A', lat: 48.8584, lng: 2.2945, type: 'restaurant' }],
            cafe: [{ id: '456', name: 'Cafe B', lat: 48.8585, lng: 2.2946, type: 'cafe' }],
        },
    })
    places: { [category: string]: NearbyPlace[] };

    @ApiProperty({ description: 'Number of places found for this location', example: 15 })
    count: number;
}

export class BulkNearbyResponse {
    @ApiProperty({ description: 'Indicates if the search was successful', example: true })
    success: boolean;

    @ApiProperty({
        description: 'Array of results for each coordinate pair',
        type: [LocationNearbyData]
    })
    data: LocationNearbyData[];

    @ApiProperty({ description: 'Total number of locations searched', example: 2 })
    totalLocations: number;

    @ApiProperty({ description: 'Total number of places found across all locations', example: 30 })
    totalPlaces: number;
}
