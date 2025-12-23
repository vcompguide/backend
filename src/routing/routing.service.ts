import { Injectable } from '@nestjs/common';
import { OsrmService } from 'src/external-api/osrm.service';
import { RouteRequestDto } from './dto/route-request.dto';

@Injectable()
export class RoutingService {
    constructor(private readonly osrmService: OsrmService) {}

    async getRoute(routeRequestDto: RouteRequestDto) {
        const { waypoints, mode } = routeRequestDto;

        const osrmData = await this.osrmService.getRoute(waypoints, mode);

        if (!osrmData.routes || osrmData.routes.length === 0) {
            return {
                success: false,
                message: 'No route found',
            };
        }

        const route = osrmData.routes[0];

        return {
            success: true,
            data: {
                distance: route.distance, // meters
                duration: route.duration, // seconds
                geometry: route.geometry, // GeoJSON LineString
                // OSRM returns many "legs" corresponding to routes between waypoints
                legs: route.legs.map((leg: any) => ({
                    distance: leg.distance,
                    duration: leg.duration,
                    summary: leg.summary,
                    steps: leg.steps.map((step: any) => ({
                        distance: step.distance,
                        duration: step.duration,
                        instruction: step.maneuver?.instruction || '',
                        name: step.name,
                        mode: step.mode,
                    })),
                })),
            },
        };
    }
}
