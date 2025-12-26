export interface MapLocation {
    id?: string;
    name: string;
    lat: number;
    lng: number;
    type: 'place' | 'address' | 'poi';
    displayName?: string;
    placeType?: string;
    importance?: number;
}
