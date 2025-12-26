import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

interface Coordinate {
    lat: number;
    lon: number;
}

@Injectable()
export class OsrmService {
    private readonly OSRM_API_URL = 'http://router.project-osrm.org/route/v1';

    constructor(private readonly httpService: HttpService) {}

    async getRoute(coordinates: Coordinate[], mode: 'driving' | 'walking' | 'cycling' = 'driving'): Promise<any> {
        const modeMapping = {
            driving: 'driving',
            walking: 'foot',
            cycling: 'bike',
        };

        const osrmMode = modeMapping[mode] || 'driving';

        const coordinatesString = coordinates.map((coord) => `${coord.lon},${coord.lat}`).join(';');

        try {
            const response: AxiosResponse = await firstValueFrom(
                this.httpService.get(`${this.OSRM_API_URL}/${osrmMode}/${coordinatesString}`, {
                    params: {
                        overview: 'full',
                        geometries: 'geojson',
                        steps: true,
                    },
                }),
            );

            const data = response.data;

            if (data.code !== 'Ok') {
                throw new HttpException(
                    `OSRM API error: ${data.message || 'Unknown error'}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!data.routes || data.routes.length === 0) {
                throw new HttpException(
                    'No route found between the specified waypoints',
                    HttpStatus.NOT_FOUND,
                );
            }

            const route = data.routes[0];

            return {
                success: true,
                data: {
                    distance: route.distance,
                    duration: route.duration,
                    geometry: route.geometry,
                    legs: route.legs.map((leg: any) => ({
                        distance: leg.distance,
                        duration: leg.duration,
                        summary: leg.summary,
                        steps: leg.steps.map((step: any) => ({
                            distance: step.distance,
                            duration: step.duration,
                            instruction: step.maneuver?.instruction || '',
                            name: step.name,
                            mode: step.mode,
                        })),
                    })),
                },
            };

        } catch (error) {
            throw new HttpException(
                `Failed to fetch route from OSRM: ${error.message || 'Unknown error'}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
