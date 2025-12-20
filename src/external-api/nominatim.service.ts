import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class NominatimService {
    private readonly baseUrl = 'https://nominatim.openstreetmap.org';

    constructor(private readonly httpService: HttpService) {}

    /**
     * Forward Geocoding - Search for locations by name or address
     * @param query - place name or address string
     * @returns JSON data from Nominatim Search API
     */
    async searchByName(query: string): Promise<any> {
        try {
            const response: AxiosResponse = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/search`, {
                    params: {
                        q: query,
                        format: 'json',
                        addressdetails: 1,
                        limit: 10,
                    },
                    headers: {
                        'User-Agent': 'NestJS-App/1.0',
                    },
                }),
            );

            return response.data;
        } catch (error) {
            throw new HttpException(`Failed to search location: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Reverse Geocoding - Search for location by coordinates
     * @param lat - latitude
     * @param lon - longitude
     * @returns JSON data from Nominatim Reverse API
     */
    async searchByCoordinates(lat: number, lon: number): Promise<any> {
        try {
            const response: AxiosResponse = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/reverse`, {
                    params: {
                        lat,
                        lon,
                        format: 'json',
                        addressdetails: 1,
                    },
                    headers: {
                        'User-Agent': 'NestJS-App/1.0',
                    },
                }),
            );

            return response.data;
        } catch (error) {
            throw new HttpException(`Failed to reverse geocode: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}
