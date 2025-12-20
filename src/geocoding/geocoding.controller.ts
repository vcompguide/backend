import { Controller, Get, Query } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { SearchPlaceDto } from './dto/search-place.dto';
import { ReverseGeocodeDto } from './dto/reverse-geocode.dto';

@Controller('geocoding')
export class GeocodingController {
    constructor(private readonly geocodingService: GeocodingService) {}

    @Get('search')
    async searchByName(@Query() searchPlaceDto: SearchPlaceDto) {
        return this.geocodingService.searchByName(searchPlaceDto.query);
    }

    @Get('reverse')
    async searchByCoordinates(@Query() reverseGeocodeDto: ReverseGeocodeDto) {
        return this.geocodingService.searchByCoordinates(reverseGeocodeDto.lat, reverseGeocodeDto.lon);
    }
}
