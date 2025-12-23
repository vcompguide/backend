import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RouteRequestDto } from './dto/route-request.dto';

@Controller('routing')
export class RoutingController {
    constructor(private readonly routingService: RoutingService) {}

	  // POST routing/
    @Post()
    @HttpCode(HttpStatus.OK)
    async getRoute(@Body() routeRequestDto: RouteRequestDto) {
        return this.routingService.getRoute(routeRequestDto);
    }
}
