import { Controller, Get, Query } from '@nestjs/common';
import { RouteRequestDto } from './dto/route-request.dto';
import { RoutingService } from './routing.service';

@Controller('routing')
export class RoutingController {
    constructor(private readonly routingService: RoutingService) {}

    // GET routing/
    @Get()
    async getRoute(@Query() routeRequestDto: RouteRequestDto) {
        return this.routingService.getRoute(routeRequestDto);
    }
}
