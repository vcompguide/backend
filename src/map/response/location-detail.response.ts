import { ApiProperty } from '@nestjs/swagger';

class Coordinate {
    @ApiProperty({ description: 'Latitude coordinate', example: 48.8584 })
    lat: number;

    @ApiProperty({ description: 'Longitude coordinate', example: 2.2945 })
    lng: number;
}

class LocationData {
    @ApiProperty({ description: 'Location coordinates', type: Coordinate })
    coordinate: Coordinate;

    @ApiProperty({
        description: 'Full address of the location',
        example: '5 Avenue Anatole France, 75007 Paris, France',
    })
    address: string;
}

export class LocationDetailResponse {
    @ApiProperty({ description: 'Indicates if the request was successful', example: true })
    success: boolean;

    @ApiProperty({ description: 'Location details and nearby places', type: LocationData })
    data: LocationData;
}
