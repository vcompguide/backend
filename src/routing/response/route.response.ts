import { OmitMethod } from '@libs/common/types';
import { ApiProperty } from '@nestjs/swagger';

export interface Step {
    distance: number;
    duration: number;
    instruction: string;
    name: string;
    mode: string;
}

export interface Leg {
    distance: number;
    duration: number;
    summary: string;
    steps: Step[];
}

export class RouteResponse {
    @ApiProperty({
        description: 'Indicates whether the request was successful',
        type: Boolean,
        example: true,
        required: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'Route data response',
        type: Object,
        example: {
            distance: 3750.5, // meters
            duration: 265.8, // seconds
            geometry: {
                coordinates: [
                    [106.660185, 10.762561],
                    [106.660329, 10.762591],
                    [106.660261, 10.762834],
                ],
                type: 'LineString', // GeoJSON LineString
            },
            // OSRM returns many "legs" corresponding to routes between waypoints
            legs: [
                {
                    distance: 3750.5,
                    duration: 265.8,
                    summary: 'Đường 3 Tháng 2, Nguyễn Phúc Nguyên',
                    steps: [
                        {
                            distance: 16.1,
                            duration: 9.5,
                            instruction: '',
                            name: 'Hẻm 189 Đường Lý Thường Kiệt',
                            mode: 'driving',
                        },
                        {
                            distance: 140.5,
                            duration: 10.4,
                            instruction: '',
                            name: 'Lý Thường Kiệt',
                            mode: 'driving',
                        },
                    ],
                },
            ],
        },
        required: true,
    })
    data: {
        distance: number;
        duration: number;
        geometry: {
            coordinates: number[][];
            type: string;
        };
        legs: Leg[];
    };

    constructor(data: OmitMethod<RouteResponse>) {
        this.success = data.success;
        this.data = data.data;
    }
}
