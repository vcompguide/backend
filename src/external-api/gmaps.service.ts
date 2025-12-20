import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    Client,
    DirectionsRequest,
    DirectionsResponse,
    PlaceType2,
    PlacesNearbyRequest,
    PlacesNearbyResponse,
} from '@googlemaps/google-maps-services-js';
import { LocationDto } from '../gmaps/dto/location.dto'

@Injectable()
export class GmapsService {
    private readonly client: Client;
    private readonly apiKey: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>("GOOGLE_MAPS_API_KEY") || "";
        this.client = new Client();
    }

    // Fetches nearby places from the Google Maps API
    async getNearbyPlaces(
        location: LocationDto,
        type: PlaceType2,
        radius = 5000, // Default 5km radius
    ): Promise<PlacesNearbyResponse['data']> {
        const request: PlacesNearbyRequest = {
            params: {
                location: [location.lat, location.lon],
                radius,
                type,
                key: this.apiKey,
            },
        };

        try {
            const response = await this.client.placesNearby(request);
            return response.data;
        } catch (error) {
            console.error('Google Maps API Error (PlacesNearby):', error);
            throw new Error('Failed to fetch nearby places');
        }
    }

    // Fetches directions (transportation path) from the Google Maps API
    async getDirections(
        origin: LocationDto,
        destination: LocationDto,
    ): Promise<DirectionsResponse['data']> {
        const request: DirectionsRequest = {
            params: {
                origin: [origin.lat, origin.lon],
                destination: [destination.lat, destination.lon],
                key: this.apiKey,
            },
        };

        try {
            const response = await this.client.directions(request);
            return response.data;
        } catch (error) {
            console.error('Google Maps API Error (Directions):', error);
            throw new Error('Failed to fetch directions');
        }
    }
}