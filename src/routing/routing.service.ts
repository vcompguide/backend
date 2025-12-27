import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OsrmService } from 'src/external-api/osrm.service';
import { RouteRequestDto } from './dto';
import { RouteResponse } from './response';

@Injectable()
export class RoutingService {
    constructor(private readonly osrmService: OsrmService) {}

    async getRoute(routeRequestDto: RouteRequestDto): Promise<RouteResponse> {
        const { waypoints, mode } = routeRequestDto;
        const result = await this.osrmService.getRoute(waypoints, mode);
        return new RouteResponse(result);
    }
}
