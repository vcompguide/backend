import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NominatimService } from '../external-api/nominatim.service';
import { OverpassService } from '../external-api/overpass.service';
import { OsrmService } from '../external-api/osrm.service';
import {
    MapLocation,
    SearchPlaceResponse,
    LocationDetailResponse,
    RouteResponse,
    RouteSummaryResponse,
    NearbyResponse,
} from './response';
import { BuildRouteDto, UpdateWaypointsDto } from './dto';

@Injectable()
export class MapService {
    constructor(
        private readonly nominatimService: NominatimService,
        private readonly overpassService: OverpassService,
        private readonly osrmService: OsrmService,
    ) {}

    /**
     * Search for places using Nominatim
     * Normalizes response to unified MapLocation format
     */
    async searchPlace(query: string, limit = 5): Promise<SearchPlaceResponse> {
        try {
            const results = await this.nominatimService.searchByName(query);

            // Normalize to MapLocation format
            const locations: MapLocation[] = results.slice(0, limit).map((result: any) => ({
                id: result.place_id?.toString(),
                name: result.name || result.display_name?.split(',')[0] || 'Unnamed',
                lat: Number.parseFloat(result.lat),
                lng: Number.parseFloat(result.lon),
                type: this.classifyLocationType(result.type),
                displayName: result.display_name,
                placeType: result.type,
                importance: result.importance,
            }));

            return {
                success: true,
                data: locations,
                count: locations.length,
            };
        } catch (error) {
            throw new HttpException(`Failed to search place: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get detailed location information including address and nearby POIs
     */
    async getLocationDetail(lat: number, lng: number): Promise<LocationDetailResponse> {
        try {
            // 1. Reverse geocode to get address
            const reverseGeocode = await this.nominatimService.searchByCoordinates(lat, lng);

            // 2. Get nearby POIs
            const nearbyPOIs = await this.overpassService.searchNearby(
                lat,
                lng,
                1000, // 1km radius
            );

            // 3. Classify location type
            const locationType = this.classifyLocationType(reverseGeocode.type);

            // 4. Organize nearby POIs by category
            const nearbyByCategory = this.organizePOIsByCategory(nearbyPOIs.places);

            return {
                success: true,
                data: {
                    coordinate: {
                        lat,
                        lng,
                    },
                    address: reverseGeocode.display_name || 'Unknown location',
                    nearby: nearbyByCategory,
                    locationType,
                },
            };
        } catch (error) {
            throw new HttpException(`Failed to get location detail: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Build a route using OSRM with optional waypoints
     */
    async buildRoute(buildRouteDto: BuildRouteDto): Promise<RouteResponse> {
        try {
            const { origin, destination, waypoints = [], mode = 'driving' } = buildRouteDto;

            // Validate and build coordinate array
            const coordinates = [
                { lat: origin.lat, lon: origin.lng },
                ...waypoints.map((wp) => ({ lat: wp.lat, lon: wp.lng })),
                { lat: destination.lat, lon: destination.lng },
            ];

            if (coordinates.length < 2) {
                throw new HttpException('At least origin and destination are required', HttpStatus.BAD_REQUEST);
            }

            // Call OSRM to get route
            const routeData = await this.osrmService.getRoute(coordinates, mode);

            if (!routeData.success) {
                throw new HttpException('Failed to calculate route', HttpStatus.BAD_REQUEST);
            }

            // Extract and format route steps
            const allSteps = routeData.data.legs.flatMap((leg: any) => leg.steps);

            // Generate route summary
            const summary = this.summarizeRoute({
                distance: routeData.data.distance,
                duration: routeData.data.duration,
                steps: allSteps,
            });

            return {
                success: true,
                data: {
                    geometry: routeData.data.geometry,
                    distance: routeData.data.distance,
                    duration: routeData.data.duration,
                    steps: allSteps,
                    summary,
                },
            };
        } catch (error) {
            throw new HttpException(`Failed to build route: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Update waypoints for an existing route
     * Recalculates the route with new waypoints
     */
    async updateWaypoints(
        origin: { lat: number; lng: number },
        destination: { lat: number; lng: number },
        updateWaypointsDto: UpdateWaypointsDto,
        mode: 'driving' | 'walking' | 'cycling' = 'driving',
    ): Promise<RouteResponse> {
        try {
            const buildRouteDto: BuildRouteDto = {
                origin: { lat: origin.lat, lng: origin.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                waypoints: updateWaypointsDto.waypoints,
                mode,
            };

            return await this.buildRoute(buildRouteDto);
        } catch (error) {
            throw new HttpException(`Failed to update waypoints: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Search for nearby places around a coordinate
     */
    async searchNearby(lat: number, lng: number, radius = 1000, amenities?: string[]): Promise<NearbyResponse> {
        try {
            const nearbyPOIs = await this.overpassService.searchNearby(lat, lng, radius, amenities);

            const organizedPOIs = this.organizePOIsByCategory(nearbyPOIs.places);

            return {
                success: true,
                data: organizedPOIs,
                count: nearbyPOIs.count,
            };
        } catch (error) {
            throw new HttpException(`Failed to search nearby: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Summarize route information
     */
    summarizeRoute(route: any): RouteSummaryResponse {
        // Convert distance to km
        const totalDistanceKm = (route.distance / 1000).toFixed(1);

        // Convert duration to minutes
        const totalTimeMinutes = Math.round(route.duration / 60);

        // Extract main roads from steps
        const mainRoads = route.steps
            .filter((step: any) => step.name && step.name !== '')
            .map((step: any) => step.name)
            .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index)
            .slice(0, 5);

        // Generate warnings based on route characteristics
        const warnings: string[] = [];
        if (route.distance > 50000) {
            warnings.push('Long distance route');
        }
        if (route.duration > 7200) {
            warnings.push('Estimated time over 2 hours');
        }

        return {
            totalDistance: `${totalDistanceKm} km`,
            totalTime: `${totalTimeMinutes} mins`,
            mainRoads,
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    }

    /**
     * Classify location type based on OSM type
     */
    private classifyLocationType(osmType: string): 'place' | 'address' | 'poi' {
        const placeTypes = ['city', 'town', 'village', 'hamlet', 'suburb', 'neighbourhood'];
        const addressTypes = ['house', 'building', 'residential', 'road', 'street'];
        const poiTypes = ['amenity', 'shop', 'tourism', 'leisure'];

        if (placeTypes.includes(osmType)) return 'place';
        if (addressTypes.includes(osmType)) return 'address';
        if (poiTypes.includes(osmType)) return 'poi';

        return 'place'; // default
    }

    /**
     * Organize POIs by their amenity category
     */
    private organizePOIsByCategory(places: any[]): Record<string, any[]> {
        const categorized: Record<string, any[]> = {};

        places.forEach((place) => {
            const category = place.tags?.amenity || place.tags?.tourism || place.tags?.shop || 'other';

            if (!categorized[category]) {
                categorized[category] = [];
            }

            categorized[category].push({
                id: place.id,
                name: place.name,
                lat: place.lat,
                lng: place.lon,
                type: category,
                tags: place.tags,
            });
        });

        return categorized;
    }
}
