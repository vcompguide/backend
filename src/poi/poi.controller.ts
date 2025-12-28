import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { PoiService } from './poi.service';
import { NearbySearchDto } from './dto/nearby-search.dto';
import { TagsSearchDto } from './dto/tags-search.dto';
import { BoundingBoxSearchDto } from './dto/bounding-box-search.dto';
import { BulkNearbySearchDto } from './dto/bulk-nearby-search.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('POI')
@Controller('poi')
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Search for nearby POI by radius' })
  @ApiResponse({ status: 200, description: 'Returns nearby POI' })
  async searchNearby(@Query() dto: NearbySearchDto) {
    return this.poiService.searchNearby(dto);
  }

  @Post('nearby/bulk')
  @ApiOperation({ summary: 'Search for nearby POI by radius for multiple coordinates' })
  @ApiResponse({ status: 200, description: 'Returns nearby POI for each coordinate pair' })
  async searchNearbyBulk(@Body() dto: BulkNearbySearchDto) {
    return this.poiService.searchNearbyBulk(dto);
  }

  // @Get('tags')
  // @ApiOperation({ summary: 'Search for POI by specific tags' })
  // @ApiResponse({ status: 200, description: 'Returns POI matching tags' })
  // async searchByTags(@Query() dto: TagsSearchDto) {
  //   return this.poiService.searchByTags(dto);
  // }

  // @Get('bounding-box')
  // @ApiOperation({ summary: 'Search for POI within a bounding box' })
  // @ApiResponse({ status: 200, description: 'Returns POI in bounding box' })
  // async searchByBoundingBox(@Query() dto: BoundingBoxSearchDto) {
  //   return this.poiService.searchByBoundingBox(dto);
  // }
}