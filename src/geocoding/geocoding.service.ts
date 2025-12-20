import { Injectable } from '@nestjs/common';
import { NominatimService } from '../external-api/nominatim.service';

@Injectable()
export class GeocodingService {
    constructor(private readonly nominatimService: NominatimService) {}

    async searchByName(query: string) {
        return await this.nominatimService.searchByName(query);
    }

    async searchByCoordinates(lat: number, lon: number) {
        return await this.nominatimService.searchByCoordinates(lat, lon);
    }
}
