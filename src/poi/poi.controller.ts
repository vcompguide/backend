import { Controller, Get, Query } from '@nestjs/common';
import { PoiService } from './poi.service';
import { NearbySearchDto } from './dto/nearby-search.dto';
import { TagsSearchDto } from './dto/tags-search.dto';
import { BoundingBoxSearchDto } from './dto/bounding-box-search.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('poi')
@Controller('poi')
export class PoiController {
  constructor(private readonly PoiService: PoiService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Search for nearby Poi by radius' })
  @ApiResponse({ status: 200, description: 'Returns nearby Poi' })
  async searchNearby(@Query() dto: NearbySearchDto) {
    return this.PoiService.searchNearby(dto);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Search for Poi by specific tags' })
  @ApiResponse({ status: 200, description: 'Returns Poi matching tags' })
  async searchByTags(@Query() dto: TagsSearchDto) {
    return this.PoiService.searchByTags(dto);
  }

  @Get('bounding-box')
  @ApiOperation({ summary: 'Search for Poi within a bounding box' })
  @ApiResponse({ status: 200, description: 'Returns Poi in bounding box' })
  async searchByBoundingBox(@Query() dto: BoundingBoxSearchDto) {
    return this.PoiService.searchByBoundingBox(dto);
  }
}