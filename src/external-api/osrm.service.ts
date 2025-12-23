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
        const mode_mapping = {
            driving: 'driving',
            walking: 'foot',
            cycling: 'bike',
        };

        const osrm_mode = mode_mapping[mode] || 'driving';

        const coordinatesString = coordinates.map((coord) => `${coord.lon},${coord.lat}`).join(';');

        try {
            const response: AxiosResponse = await firstValueFrom(
                this.httpService.get(`${this.OSRM_API_URL}/${osrm_mode}/${coordinatesString}`, {
                    params: {
                        overview: 'full',
                        geometries: 'geojson',
                        steps: true,
                    },
                }),
            );

            const data = response.data;
            if (data.code !== 'Ok') {
                throw new HttpException(`OSRM API error: ${data.message || 'Unknown error'}`, HttpStatus.BAD_REQUEST);
            }

            return data;
        } catch (error) {
            throw new HttpException(
                `Failed to fetch route from OSRM: ${error.message || 'Unknown error'}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
