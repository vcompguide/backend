import { OmitMethod } from '@libs/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class GeoPointResponse {
  @ApiProperty({
    description: 'Coordinates of the geographical point as [longitude, latitude]',
    type: Number,
  })
  x!: number;

  @ApiProperty({
    description: 'Coordinates of the geographical point as [longitude, latitude]',
    type: Number,
  })
  y!: number;

  constructor(data: OmitMethod<GeoPointResponse>) {
    this.x = data.x;
    this.y = data.y;
  }
}

export class PlaceResponse {
  @ApiProperty({
    description: 'Unique identifier of the place',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Geographical location of the place',
    type: GeoPointResponse,
  })
  location: GeoPointResponse;

  @ApiProperty({
    description: 'Tags associated with the place',
    type: [String],
  })
  tags: string[];

  constructor(data: OmitMethod<PlaceResponse>) {
    this.name = data.name;
    this.location = new GeoPointResponse(data.location);
    this.tags = data.tags;
  }
}

export class PlacesResponse {
  @ApiProperty({
    description: 'List of places',
    type: [PlaceResponse],
  })
  places: PlaceResponse[];

  constructor(data: OmitMethod<PlacesResponse>) {
    this.places = data.places.map((place) => new PlaceResponse(place));
  }
}
