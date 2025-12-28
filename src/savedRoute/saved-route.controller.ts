import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSavedRouteDto } from './dto/create-saved-route.dto';
import { CreateRouteResponse, CreateSavedRouteResponse } from './response/saved-route.response';
import { SavedRouteService } from './saved-route.service';

@ApiTags('Saved Route')
@Controller('saved-route')
export class SavedRouteController {
    constructor(private readonly savedRouteService: SavedRouteService) {}

    @Post()
    @ApiOperation({ summary: 'Create a saved route (overwrite old one if exists)' })
    @ApiResponse({
        status: 201,
        description: 'The saved route has been successfully created.',
        type: CreateSavedRouteResponse,
    })
    async createSavedRoute(@Body() savedRouteDto: CreateSavedRouteDto) {
        return new CreateSavedRouteResponse(await this.savedRouteService.createSavedRoute(savedRouteDto));
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Get saved routes for a user' })
    @ApiResponse({
        status: 200,
        description: 'List of saved routes for the user.',
        type: CreateSavedRouteResponse,
    })
    async getSavedRoutesByUserId(@Query('userId') userId: string) {
        const route = await this.savedRouteService.getSavedRoutesByUserId(userId);
        if (route === null) {
            return new CreateSavedRouteResponse({ userId, route: [] });
        }
        return new CreateSavedRouteResponse(route);
    }
}
