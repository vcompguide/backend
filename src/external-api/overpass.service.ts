import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    async searchNearby(
        latitude: number,
        longitude: number,
        radius: number,
        amenities?: string[],
    ): Promise<any> {
        try {
            let query: string;
            if (amenities && amenities.length > 0) {
                // Search for multiple specific amenities with OR logic
                const amenityQueries = amenities.map(a => 
                    `node["amenity"="${a}"](around:${radius},${latitude},${longitude});`
                ).join('\n                  ');
                
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
            throw new HttpException(
                `Failed to search nearby locations: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
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
            throw new HttpException(
                `Failed to search by tags: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
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
                const amenityQueries = amenities.map(a => 
                    `node["amenity"="${a}"](${south},${west},${north},${east});`
                ).join('\n                  ');
                
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
            throw new HttpException(
                `Failed to search by bounding box: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    /**
     * Execute Overpass query with retry logic and fallback server
     */
    private async executeQuery(query: string): Promise<any> {
        // Try primary server first
        try {
            const response = await axios.post(
                this.OVERPASS_API_URL,
                query,
                {
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    timeout: 60000, // 60 seconds
                }
            );
            return this.formatResponse(response.data);
        } catch (primaryError) {
            // If primary fails, try backup server
            try {
                const response = await axios.post(
                    this.BACKUP_API_URL,
                    query,
                    {
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        timeout: 60000,
                    }
                );
                return this.formatResponse(response.data);
            } catch (backupError) {
                throw primaryError; // Throw original error
            }
        }
    }

    /**
     * Search for nearby locations by radius for multiple coordinate pairs
     * @param coordinates Array of coordinate pairs (latitude, longitude)
     * @param radius Search radius in meters
     * @param amenities Optional array of amenity types to search for
     * @returns Array of results for each coordinate pair
     */
    async searchNearbyBulk(
        coordinates: Array<{ latitude: number; longitude: number }>,
        radius: number,
        amenities?: string[],
    ): Promise<any[]> {
        try {
            // Build a single optimized query with multiple coordinates in a union
            let nodeQueries: string[] = [];
            
            if (amenities && amenities.length > 0) {
                // For each coordinate and each amenity, create a node query
                coordinates.forEach(coord => {
                    amenities.forEach(amenity => {
                        nodeQueries.push(
                            `node(around:${radius},${coord.latitude},${coord.longitude})["amenity"="${amenity}"];`
                        );
                    });
                });
            } else {
                // For each coordinate, search for all amenities
                coordinates.forEach(coord => {
                    nodeQueries.push(
                        `node(around:${radius},${coord.latitude},${coord.longitude})["amenity"];`
                    );
                });
            }

            const query = `
                [out:json][timeout:60];
                (
                  ${nodeQueries.join('\n  ')}
                );
                out center ${this.MAX_RESULTS};
            `;

            // Execute single optimized query for all coordinates
            const allResults = await this.executeQuery(query);

            // Group results by closest coordinate
            const resultsByCoordinate = coordinates.map(coord => ({
                latitude: coord.latitude,
                longitude: coord.longitude,
                places: [] as any[],
                count: 0,
            }));

            // Assign each place to the nearest coordinate
            allResults.places.forEach((place: any) => {
                let minDistance = Number.MAX_VALUE;
                let closestIndex = 0;

                coordinates.forEach((coord, index) => {
                    const distance = this.calculateDistance(
                        place.lat,
                        place.lon,
                        coord.latitude,
                        coord.longitude
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                });

                // Only add if within radius
                if (minDistance <= radius) {
                    resultsByCoordinate[closestIndex].places.push(place);
                }
            });

            // Update counts and remove duplicates per coordinate
            resultsByCoordinate.forEach(result => {
                // Remove duplicate places by id
                const uniquePlaces = result.places.filter((place, index, self) => 
                    index === self.findIndex(p => p.id === place.id)
                );
                result.places = uniquePlaces;
                result.count = uniquePlaces.length;
            });

            return resultsByCoordinate;
        } catch (error) {
            throw new HttpException(
                `Failed to search nearby locations in bulk: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    /**
     * Calculate distance between two coordinates in meters using Haversine formula
     */
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371000; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Format the Overpass API response into a more user-friendly structure
     */
    private formatResponse(data: any): any {
        if (!data || !data.elements) {
            return { places: [], count: 0 };
        }

        const places = data.elements
            .filter(element => element.type === 'node' || element.type === 'way')
            .map(element => ({
                id: element.id,
                type: element.type,
                lat: element.lat || element.center?.lat,
                lon: element.lon || element.center?.lon,
                tags: element.tags || {},
                name: element.tags?.name || 'Unnamed',
            }))
            .filter(place => place.lat && place.lon);

        return {
            places,
            count: places.length,
            timestamp: new Date().toISOString(),
        };
    }
}