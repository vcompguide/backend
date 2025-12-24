import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlaceFilterDto } from './dtos';
import { PlaceService } from './place.service';
import { PlacesResponse } from './response';

@ApiTags('Place')
@Controller('place')
export class PlaceController {
    constructor(private readonly placeService: PlaceService) {}

    @ApiOperation({
        summary: 'Get places filtered by tags',
        description: 'Retrieve a list of places that match the specified tags.',
    })
    @ApiResponse({
        status: 200,
        description: 'Places retrieved successfully',
        type: PlacesResponse,
    })
    @Get('by-tags')
    getPlacesByTags(@Query() query: PlaceFilterDto) {
        return new PlacesResponse({
            places: this.placeService.getPlaceFilterByTags(query.tags),
        });
    }
}
