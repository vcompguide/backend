import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NominatimService {
    private readonly baseUrl = 'https://nominatim.openstreetmap.org';

    constructor(private readonly httpService: HttpService) {}

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
            throw new HttpException(
                `Failed to search location: ${error.message || 'Unknown error'}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

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
            throw new HttpException(
                `Failed to reverse geocode: ${error.message || 'Unknown error'}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
