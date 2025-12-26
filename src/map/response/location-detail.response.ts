export class LocationDetailResponse {
    success: boolean;
    data: {
        coordinate: {
            lat: number;
            lng: number;
        };
        address: string;
        nearby: {
            [category: string]: Array<{
                id: string | number;
                name: string;
                lat: number;
                lng: number;
                type: string;
                tags?: Record<string, any>;
            }>;
        };
        locationType?: string;
    };
}
