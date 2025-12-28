import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlaceFilterDto } from './dtos';
import { PlaceService } from './place.service';
import { PlaceResponse, PlacesResponse } from './response';
import { Place } from '@libs/coredb/schemas/place.schema';
import { CreatePlaceDto } from './dtos/create-place.dto';

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

    @ApiOperation({
        summary: 'Insert place from external source',
        description: 'Insert a new place into the database from an external source using its identifier.',
    })
    @ApiResponse({
        status: 200,
        description: 'Place inserted successfully',
        type: PlacesResponse,
    })
    @Post('insert')
    async insert(@Body() query: CreatePlaceDto) {
        return new PlaceResponse(await this.placeService.createPlace(query));
    }
}
