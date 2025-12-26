import { ApiProperty } from '@nestjs/swagger';

export class MapLocation {
    @ApiProperty({
        description: 'Unique identifier for the location',
        required: false,
        example: '123456789',
    })
    id?: string;

    @ApiProperty({
        description: 'Name of the location',
        example: 'Eiffel Tower',
    })
    name: string;

    @ApiProperty({
        description: 'Latitude coordinate',
        example: 48.8584,
    })
    lat: number;

    @ApiProperty({
        description: 'Longitude coordinate',
        example: 2.2945,
    })
    lng: number;

    @ApiProperty({
        description: 'Type classification of the location',
        enum: ['place', 'address', 'poi'],
        example: 'poi',
    })
    type: 'place' | 'address' | 'poi';

    @ApiProperty({
        description: 'Full display name with address details',
        required: false,
        example: 'Eiffel Tower, Paris, France',
    })
    displayName?: string;

    @ApiProperty({
        description: 'Specific type of place',
        required: false,
        example: 'attraction',
    })
    placeType?: string;

    @ApiProperty({
        description: 'Importance score of the location',
        required: false,
        example: 0.8,
    })
    importance?: number;
}
