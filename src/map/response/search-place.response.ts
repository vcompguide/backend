import { MapLocation } from './map-location.interface';

export class SearchPlaceResponse {
    success: boolean;
    data: MapLocation[];
    count: number;
}
