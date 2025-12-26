import { Controller, Get, Post, Body, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MapService } from './map.service';
import { SearchPlaceDto, LocationDetailDto, BuildRouteDto, UpdateWaypointsDto, NearbySearchDto } from './dto';
import { SearchPlaceResponse, LocationDetailResponse, RouteResponse, NearbyResponse } from './response';

@ApiTags('Map')
@Controller('map')
export class MapController {
    constructor(private readonly mapService: MapService) {}

    @Get('search')
    @ApiOperation({
        summary: 'Search for places by name',
        description:
            'Search for locations, addresses, and points of interest by name using Nominatim geocoding service',
    })
    @ApiQuery({ name: 'q', description: 'Search query string', example: 'Eiffel Tower' })
    @ApiQuery({ name: 'limit', description: 'Maximum number of results', required: false, example: 5 })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Places found successfully',
        type: SearchPlaceResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid search parameters or search failed',
    })
    async searchPlace(@Query() searchDto: SearchPlaceDto): Promise<SearchPlaceResponse> {
        return await this.mapService.searchPlace(searchDto.q, searchDto.limit);
    }

    @Get('location')
    @ApiOperation({
        summary: 'Get detailed location information',
        description: 'Retrieve comprehensive details about a specific location using its coordinates',
    })
    @ApiQuery({ name: 'lat', description: 'Latitude coordinate', example: 48.8584 })
    @ApiQuery({ name: 'lng', description: 'Longitude coordinate', example: 2.2945 })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Location details retrieved successfully',
        type: LocationDetailResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid coordinates or request failed',
    })
    async getLocationDetail(@Query() locationDto: LocationDetailDto): Promise<LocationDetailResponse> {
        return await this.mapService.getLocationDetail(locationDto.lat, locationDto.lng);
    }

    @Post('route')
    @ApiOperation({
        summary: 'Build a route between two locations',
        description:
            'Calculate an optimized route between origin and destination with optional waypoints using OSRM routing service',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Route calculated successfully',
        type: RouteResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid coordinates or routing parameters',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Failed to communicate with routing service',
    })
    async buildRoute(@Body() buildRouteDto: BuildRouteDto): Promise<RouteResponse> {
        return await this.mapService.buildRoute(buildRouteDto);
    }

    @Post('route/waypoints')
    @ApiOperation({
        summary: 'Update route waypoints',
        description: 'Recalculate a route with updated waypoints between origin and destination',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Route recalculated with new waypoints successfully',
        type: RouteResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid waypoints, coordinates, or travel mode',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Failed to communicate with routing service',
    })
    async updateWaypoints(
        @Body()
        body: {
            origin: { lat: number; lng: number };
            destination: { lat: number; lng: number };
            waypoints: UpdateWaypointsDto;
            mode?: 'driving' | 'walking' | 'cycling';
        },
    ): Promise<RouteResponse> {
        return await this.mapService.updateWaypoints(body.origin, body.destination, body.waypoints, body.mode);
    }

    @Get('nearby')
    @ApiOperation({
        summary: 'Search for nearby places',
        description: 'Find nearby amenities and points of interest within a specified radius using Overpass API',
    })
    @ApiQuery({ name: 'lat', description: 'Center latitude coordinate', example: 48.8584 })
    @ApiQuery({ name: 'lng', description: 'Center longitude coordinate', example: 2.2945 })
    @ApiQuery({ name: 'radius', description: 'Search radius in meters', required: false, example: 1000 })
    @ApiQuery({
        name: 'amenities',
        description: 'Comma-separated list of amenity types',
        required: false,
        example: 'restaurant,cafe,hotel',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Nearby places found successfully',
        type: NearbyResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid coordinates, radius, or search parameters',
    })
    async searchNearby(@Query() nearbyDto: NearbySearchDto): Promise<NearbyResponse> {
        return await this.mapService.searchNearby(nearbyDto.lat, nearbyDto.lng, nearbyDto.radius, nearbyDto.amenities);
    }
}
