import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RouteRequestDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RouteResponse } from './response';

@ApiTags('Routing')
@Controller('routing')
export class RoutingController {
    constructor(private readonly routingService: RoutingService) {}

    // POST api/routing/
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get a route passing through user\'s waypoints',
        description: 'Get the most suitable route passing through user\'s waypoints with a specific vehicle mode'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Route found successfully',
        type: RouteResponse,
    })
    async getRoute(@Body() routeRequestDto: RouteRequestDto) {
        return this.routingService.getRoute(routeRequestDto);
    }
}
