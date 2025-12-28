import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RouteRequestDto } from './dto';
import { RouteResponse } from './response';
import { RoutingService } from './routing.service';

@ApiTags('Routing')
@Controller('routing')
export class RoutingController {
    constructor(private readonly routingService: RoutingService) {}

    // POST api/routing/
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Get a route passing through the user's waypoints",
        description: "Get the most suitable route passing through the user's waypoints with a specific vehicle mode",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Route found successfully',
        type: RouteResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid waypoints or travel mode',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'No route found between the specified waypoints',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Failed to communicate with OSRM service',
    })
    async getRoute(@Body() routeRequestDto: RouteRequestDto): Promise<RouteResponse> {
        return this.routingService.getRoute(routeRequestDto);
    }
}
