import { Injectable } from '@nestjs/common';
import { OsrmService } from 'src/external-api/osrm.service';
import { RouteRequestDto } from './dto/route-request.dto';

@Injectable()
export class RoutingService {
    constructor(private readonly osrmService: OsrmService) {}

    async getRoute(routeRequestDto: RouteRequestDto) {
        const { originLat, originLon, destinationLat, destinationLon, mode } = routeRequestDto;

        const osrmData = await this.osrmService.getRoute(originLat, originLon, destinationLat, destinationLon, mode);

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
                legs: route.legs.map((leg) => ({
                    distance: leg.distance,
                    duration: leg.duration,
                    steps: leg.steps.map((step) => ({
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
