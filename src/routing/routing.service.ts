import { Injectable } from '@nestjs/common';
import { OsrmService } from 'src/external-api/osrm.service';
import { RouteRequestDto } from './dto/route-request.dto';

@Injectable()
export class RoutingService {
    constructor(private readonly osrmService: OsrmService) {}

    async getRoute(routeRequestDto: RouteRequestDto) {
        const { waypoints, mode } = routeRequestDto;

        // Truyền danh sách waypoints sang OsrmService
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
                distance: route.distance, // meters - Tổng quãng đường
                duration: route.duration, // seconds - Tổng thời gian
                geometry: route.geometry, // GeoJSON LineString của toàn bộ hành trình
                // OSRM sẽ trả về nhiều "legs" tương ứng với các đoạn giữa các waypoints
                legs: route.legs.map((leg) => ({
                    distance: leg.distance,
                    duration: leg.duration,
                    summary: leg.summary,
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
