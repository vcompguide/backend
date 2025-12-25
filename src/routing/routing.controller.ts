import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RouteRequestDto } from './dto';

@Controller('routing')
export class RoutingController {
    constructor(private readonly routingService: RoutingService) {}

    // POST api/routing/
    @Post()
    @HttpCode(HttpStatus.OK)
    async getRoute(@Body() routeRequestDto: RouteRequestDto) {
        return this.routingService.getRoute(routeRequestDto);
    }
}
