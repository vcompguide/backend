import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateFavoritesDto } from './dto/index';
import { FavoriteService } from './favorite.service';
import { FavoriteIdsResponse, UpdateFavoriteResponse } from './response/index';

@ApiTags('Favorites')
@Controller('favorites')
@ApiBearerAuth()
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    /**
     * GET /api/favorites
     * Query operation: Get list of favorite place IDs
     */
    @Get(':userId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get favorite place IDs',
        description: 'Query operation: Retrieve list of favorite place IDs for the authenticated user',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Favorite IDs retrieved successfully',
        type: FavoriteIdsResponse,
    })
    async getFavoriteIds(@Query('userId') userId: string): Promise<FavoriteIdsResponse> {
        return this.favoriteService.getFavoriteIds(userId);
    }

    /**
     * POST /api/favorites
     * Write operation: Update all favorites
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Update favorites',
        description: 'Write operation: Save list of favorite place IDs (replaces existing favorites)',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Favorites saved successfully',
        type: UpdateFavoriteResponse,
    })
    async updateFavorites(
        @Request() req,
        @Body() updateFavoritesDto: UpdateFavoritesDto,
    ): Promise<UpdateFavoriteResponse> {
        const userId = req.user?.id;
        return this.favoriteService.updateFavorites(userId, updateFavoritesDto);
    }
}
