import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MapService } from './map.service';
import { SearchPlaceDto, LocationDetailDto, BuildRouteDto, UpdateWaypointsDto, NearbySearchDto } from './dto';
import { SearchPlaceResponse, LocationDetailResponse, RouteResponse, NearbyResponse } from './response';

@Controller('map')
export class MapController {
    constructor(private readonly mapService: MapService) {}

    /**
     * GET /map/search?q=<query>&limit=<number>
     * Search for places by name
     */
    @Get('search')
    async searchPlace(@Query() searchDto: SearchPlaceDto): Promise<SearchPlaceResponse> {
        return await this.mapService.searchPlace(searchDto.q, searchDto.limit);
    }

    /**
     * GET /map/location?lat=<latitude>&lng=<longitude>
     * Get detailed location information
     */
    @Get('location')
    async getLocationDetail(@Query() locationDto: LocationDetailDto): Promise<LocationDetailResponse> {
        return await this.mapService.getLocationDetail(locationDto.lat, locationDto.lng);
    }

    /**
     * POST /map/route
     * Build a route between origin and destination with optional waypoints
     */
    @Post('route')
    async buildRoute(@Body() buildRouteDto: BuildRouteDto): Promise<RouteResponse> {
        return await this.mapService.buildRoute(buildRouteDto);
    }

    /**
     * POST /map/route/waypoints
     * Update waypoints for a route
     * Requires origin, destination, and new waypoints
     */
    @Post('route/waypoints')
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

    /**
     * GET /map/nearby?lat=<latitude>&lng=<longitude>&radius=<meters>&amenities=<comma-separated>
     * Search for nearby places
     */
    @Get('nearby')
    async searchNearby(@Query() nearbyDto: NearbySearchDto): Promise<NearbyResponse> {
        return await this.mapService.searchNearby(nearbyDto.lat, nearbyDto.lng, nearbyDto.radius, nearbyDto.amenities);
    }
}
