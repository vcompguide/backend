import { Injectable } from '@nestjs/common';
import { OverpassService } from '../external-api/overpass.service';
import { NearbySearchDto } from './dto/nearby-search.dto';
import { TagsSearchDto } from './dto/tags-search.dto';
import { BoundingBoxSearchDto } from './dto/bounding-box-search.dto';
import { BulkNearbySearchDto } from './dto/bulk-nearby-search.dto';

@Injectable()
export class PoiService {
  constructor(private readonly overpassService: OverpassService) {}

  async searchNearby(dto: NearbySearchDto) {
    return this.overpassService.searchNearby(
      dto.latitude,
      dto.longitude,
      dto.radius,
      dto.amenities,
    );
  }

  async searchNearbyBulk(dto: BulkNearbySearchDto) {
    return this.overpassService.searchNearbyBulk(
      dto.coordinates,
      dto.radius,
      dto.amenities,
    );
  }

  async searchByTags(dto: TagsSearchDto) {
    return this.overpassService.searchByTags(
      dto.latitude,
      dto.longitude,
      dto.radius,
      dto.tags,
    );
  }

  async searchByBoundingBox(dto: BoundingBoxSearchDto) {
    return this.overpassService.searchByBoundingBox(
      dto.south,
      dto.west,
      dto.north,
      dto.east,
      dto.amenities,
    );
  }
}