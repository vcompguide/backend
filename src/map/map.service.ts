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
import { BulkNearbyResponse } from './response/bulk-nearby.response';
import { BuildRouteDto, UpdateWaypointsDto } from './dto';

@Injectable()
export class MapService {
    constructor(
        private readonly nominatimService: NominatimService,
        private readonly overpassService: OverpassService,
        private readonly osrmService: OsrmService,
    ) {}

    async searchPlace(query: string, limit = 5): Promise<SearchPlaceResponse> {
        try {
            const results = await this.nominatimService.searchByName(query);

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

    async getLocationDetail(lat: number, lng: number): Promise<LocationDetailResponse> {
        try {
            const reverseGeocode = await this.nominatimService.searchByCoordinates(lat, lng);

            const nearbyPOIs = await this.overpassService.searchNearby(lat, lng, 1000);

            const locationType = this.classifyLocationType(reverseGeocode.type);

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

    async buildRoute(buildRouteDto: BuildRouteDto): Promise<RouteResponse> {
        try {
            const { origin, destination, waypoints = [], mode = 'driving' } = buildRouteDto;

            const coordinates = [
                { lat: origin.lat, lon: origin.lng },
                ...waypoints.map((wp) => ({ lat: wp.lat, lon: wp.lng })),
                { lat: destination.lat, lon: destination.lng },
            ];

            if (coordinates.length < 2) {
                throw new HttpException('At least origin and destination are required', HttpStatus.BAD_REQUEST);
            }

            const routeData = await this.osrmService.getRoute(coordinates, mode);

            if (!routeData.success) {
                throw new HttpException('Failed to calculate route', HttpStatus.BAD_REQUEST);
            }

            const allSteps = routeData.data.legs.flatMap((leg: any) => leg.steps);

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

    async searchNearbyBulk(
        coordinates: Array<{ lat: number; lng: number }>,
        radius = 1000,
        amenities?: string[],
    ): Promise<BulkNearbyResponse> {
        try {
            const coordinatesFormatted = coordinates.map(coord => ({
                latitude: coord.lat,
                longitude: coord.lng,
            }));

            const bulkResults = await this.overpassService.searchNearbyBulk(
                coordinatesFormatted,
                radius,
                amenities,
            );

            const formattedResults = bulkResults.map(result => ({
                latitude: result.latitude,
                longitude: result.longitude,
                places: this.organizePOIsByCategory(result.places || []),
                count: result.count || 0,
            }));

            const totalPlaces = formattedResults.reduce((sum, result) => sum + result.count, 0);

            return {
                success: true,
                data: formattedResults,
                totalLocations: coordinates.length,
                totalPlaces,
            };
        } catch (error) {
            throw new HttpException(`Failed to search nearby in bulk: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    summarizeRoute(route: any): RouteSummaryResponse {
        const totalDistanceKm = (route.distance / 1000).toFixed(1);

        const totalTimeMinutes = Math.round(route.duration / 60);

        const mainRoads = route.steps
            .filter((step: any) => step.name && step.name !== '')
            .map((step: any) => step.name)
            .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index)
            .slice(0, 5);

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

    private classifyLocationType(osmType: string): 'place' | 'address' | 'poi' {
        const placeTypes = ['city', 'town', 'village', 'hamlet', 'suburb', 'neighbourhood'];
        const addressTypes = ['house', 'building', 'residential', 'road', 'street'];
        const poiTypes = ['amenity', 'shop', 'tourism', 'leisure'];

        if (placeTypes.includes(osmType)) return 'place';
        if (addressTypes.includes(osmType)) return 'address';
        if (poiTypes.includes(osmType)) return 'poi';

        return 'place'; // default
    }

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
