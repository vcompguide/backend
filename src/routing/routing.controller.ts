import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RouteRequestDto } from './dto/route-request.dto';

@Controller('routing')
export class RoutingController {
    constructor(private readonly routingService: RoutingService) {}

    // Đổi sang POST để gửi body JSON chứa mảng waypoints
    @Post()
    @HttpCode(HttpStatus.OK) // Trả về 200 OK thay vì 201 Created mặc định của POST
    async getRoute(@Body() routeRequestDto: RouteRequestDto) {
        return this.routingService.getRoute(routeRequestDto);
    }
}
