import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class OsrmService {
    private readonly OSRM_API_URL = 'http://router.project-osrm.org/route/v1';

    async getRoute(
        start_lat: number,
        start_lon: number,
        end_lat: number,
        end_lon: number,
        mode: 'driving' | 'walking' | 'cycling' = 'driving',
    ) {
        const mode_mapping = {
            driving: 'driving',
            walking: 'foot',
            cycling: 'bike',
        };
        const osrm_mode = mode_mapping[mode] || 'driving';

        const url = `${this.OSRM_API_URL}/${osrm_mode}/${start_lon},${start_lat};${end_lon},${end_lat}?overview=full&geometries=geojson`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new HttpException('Failed to fetch route from OSRM', HttpStatus.BAD_GATEWAY);
            }

            const data = await response.json();
            if (data.code !== 'Ok') {
                throw new HttpException(`OSRM API error: ${data.message || 'Unknown error'}`, HttpStatus.BAD_REQUEST);
            }

            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error communicating with OSRM service', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
