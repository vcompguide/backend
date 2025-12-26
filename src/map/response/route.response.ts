import { ApiProperty } from '@nestjs/swagger';

class RouteStep {
    @ApiProperty({ description: 'Step distance in meters', example: 250 })
    distance: number;

    @ApiProperty({ description: 'Step duration in seconds', example: 60 })
    duration: number;

    @ApiProperty({ description: 'Turn-by-turn instruction', example: 'Turn right onto Main Street' })
    instruction: string;

    @ApiProperty({ description: 'Road or street name', example: 'Main Street' })
    name: string;

    @ApiProperty({ description: 'Travel mode for this step', example: 'driving' })
    mode: string;
}

class RouteSummary {
    @ApiProperty({ description: 'Human-readable total distance', example: '5.2 km' })
    totalDistance: string;

    @ApiProperty({ description: 'Human-readable total time', example: '12 mins' })
    totalTime: string;

    @ApiProperty({
        description: 'List of main roads on the route',
        type: [String],
        example: ['Main Street', 'Highway 101'],
    })
    mainRoads: string[];

    @ApiProperty({
        description: 'Route warnings if any',
        type: [String],
        required: false,
        example: ['Heavy traffic ahead'],
    })
    warnings?: string[];
}

class RouteData {
    @ApiProperty({ description: 'Route geometry (GeoJSON or encoded polyline)' })
    geometry: any;

    @ApiProperty({ description: 'Total route distance in meters', example: 5200 })
    distance: number;

    @ApiProperty({ description: 'Total route duration in seconds', example: 720 })
    duration: number;

    @ApiProperty({ description: 'Turn-by-turn navigation steps', type: [RouteStep] })
    steps: RouteStep[];

    @ApiProperty({ description: 'Route summary information', type: RouteSummary, required: false })
    summary?: RouteSummary;
}

export class RouteResponse {
    @ApiProperty({ description: 'Indicates if route calculation was successful', example: true })
    success: boolean;

    @ApiProperty({ description: 'Route data and details', type: RouteData })
    data: RouteData;
}
