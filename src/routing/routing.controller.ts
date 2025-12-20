import { Controller, Get, Query } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RouteRequestDto } from './dto/route-request.dto';

@Controller('routing')
export class RoutingController {
    constructor(private readonly routingService: RoutingService) {}

    // GET routing/
    @Get()
    async getRoute(@Query() routeRequestDto: RouteRequestDto) {
        return this.routingService.getRoute(routeRequestDto);
    }
}
