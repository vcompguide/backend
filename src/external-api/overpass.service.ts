import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OverpassService {
    private readonly OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
    private readonly BACKUP_API_URL = 'https://overpass.kumi.systems/api/interpreter';
    private readonly MAX_RESULTS = 100;

    /**
     * Search for nearby locations by radius
     * @param latitude Center point latitude
     * @param longitude Center point longitude
     * @param radius Search radius in meters
     * @param amenities Optional array of amenity types to search for
     * @returns Array of places found
     */
    async searchNearby(latitude: number, longitude: number, radius: number, amenities?: string[]): Promise<any> {
        try {
            let query: string;
            if (amenities && amenities.length > 0) {
                // Search for multiple specific amenities with OR logic
                const amenityQueries = amenities
                    .map((a) => `node["amenity"="${a}"](around:${radius},${latitude},${longitude});`)
                    .join('\n                  ');

                query = `
                    [out:json][timeout:25];
                    (
                      ${amenityQueries}
                    );
                    out center ${this.MAX_RESULTS};
                `;
            } else {
                // Search for all amenities
                query = `
                    [out:json][timeout:25];
                    (
                      node["amenity"](around:${radius},${latitude},${longitude});
                    );
                    out center ${this.MAX_RESULTS};
                `;
            }

            return await this.executeQuery(query);
        } catch (error) {
            throw new HttpException(`Failed to search nearby locations: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Search for locations by specific tags
     * @param latitude Center point latitude
     * @param longitude Center point longitude
     * @param radius Search radius in meters
     * @param tags Key-value pairs of tags to search for
     * @returns Array of places found
     */
    async searchByTags(
        latitude: number,
        longitude: number,
        radius: number,
        tags: Record<string, string>,
    ): Promise<any> {
        try {
            const tagFilters = Object.entries(tags)
                .map(([key, value]) => `["${key}"="${value}"]`)
                .join('');

            const query = `
                [out:json][timeout:25];
                (
                  node${tagFilters}(around:${radius},${latitude},${longitude});
                );
                out center ${this.MAX_RESULTS};
            `;

            return await this.executeQuery(query);
        } catch (error) {
            throw new HttpException(`Failed to search by tags: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Search for locations within a bounding box
     * @param south South latitude
     * @param west West longitude
     * @param north North latitude
     * @param east East longitude
     * @param amenities Optional array of amenity types to search for
     * @returns Array of places found
     */
    async searchByBoundingBox(
        south: number,
        west: number,
        north: number,
        east: number,
        amenities?: string[],
    ): Promise<any> {
        try {
            let query: string;
            if (amenities && amenities.length > 0) {
                const amenityQueries = amenities
                    .map((a) => `node["amenity"="${a}"](${south},${west},${north},${east});`)
                    .join('\n                  ');

                query = `
                    [out:json][timeout:25];
                    (
                      ${amenityQueries}
                    );
                    out center ${this.MAX_RESULTS};
                `;
            } else {
                query = `
                    [out:json][timeout:25];
                    (
                      node["amenity"](${south},${west},${north},${east});
                    );
                    out center ${this.MAX_RESULTS};
                `;
            }

            return await this.executeQuery(query);
        } catch (error) {
            throw new HttpException(`Failed to search by bounding box: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Execute Overpass query with retry logic and fallback server
     */
    private async executeQuery(query: string): Promise<any> {
        // Try primary server first
        try {
            const response = await axios.post(this.OVERPASS_API_URL, query, {
                headers: {
                    'Content-Type': 'text/plain',
                },
                timeout: 60000, // 60 seconds
            });
            return this.formatResponse(response.data);
        } catch (primaryError) {
            // If primary fails, try backup server
            try {
                const response = await axios.post(this.BACKUP_API_URL, query, {
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    timeout: 60000,
                });
                return this.formatResponse(response.data);
            } catch (backupError) {
                throw primaryError; // Throw original error
            }
        }
    }

    /**
     * Format the Overpass API response into a more user-friendly structure
     */
    private formatResponse(data: any): any {
        if (!data || !data.elements) {
            return { places: [], count: 0 };
        }

        const places = data.elements
            .filter((element) => element.type === 'node' || element.type === 'way')
            .map((element) => ({
                id: element.id,
                type: element.type,
                lat: element.lat || element.center?.lat,
                lon: element.lon || element.center?.lon,
                tags: element.tags || {},
                name: element.tags?.name || 'Unnamed',
            }))
            .filter((place) => place.lat && place.lon);

        return {
            places,
            count: places.length,
            timestamp: new Date().toISOString(),
        };
    }
}
