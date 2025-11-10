import { Controller, Post, Body } from "@nestjs/common";
import { GmapsService } from "src/external-api/gmaps.service";
import { NearbyPlacesDto } from "./dto/nearby-places.dto";
import { DirectionsDto } from "./dto/directions.dto";

@Controller('gmaps')
export class GmapsController {
    constructor(private readonly gmapsService: GmapsService) {}

    // POST /gmaps/nearby-places
    @Post('nearby-places')
    async getNearbyPlaces(@Body() nearbyPlacesDto: NearbyPlacesDto) {
        const {location, type, radius} = nearbyPlacesDto;
        return this.gmapsService.getNearbyPlaces(location, type, radius);
    }

    // POST /gmaps/directions
    @Post('directions')
    async getDirections(@Body() directionsDto: DirectionsDto) {
        const {origin, destination} = directionsDto;
        return this.gmapsService.getDirections(origin, destination);
    }
}
