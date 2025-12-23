import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Định nghĩa interface nội bộ để type checking
interface Coordinate {
    lat: number;
    lon: number;
}

@Injectable()
export class OsrmService {
    private readonly OSRM_API_URL = 'http://router.project-osrm.org/route/v1';

    async getRoute(coordinates: Coordinate[], mode: 'driving' | 'walking' | 'cycling' = 'driving') {
        const mode_mapping = {
            driving: 'driving',
            walking: 'foot',
            cycling: 'bike',
        };
        const osrm_mode = mode_mapping[mode] || 'driving';

        // Tạo chuỗi coordinates: "lon1,lat1;lon2,lat2;..."
        const coordinatesString = coordinates.map((coord) => `${coord.lon},${coord.lat}`).join(';');

        const url = `${this.OSRM_API_URL}/${osrm_mode}/${coordinatesString}?overview=full&geometries=geojson&steps=true`;

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
