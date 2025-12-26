export class NearbyResponse {
    success: boolean;
    data: {
        [category: string]: Array<{
            id: string | number;
            name: string;
            lat: number;
            lng: number;
            type: string;
            tags?: Record<string, any>;
        }>;
    };
    count: number;
}
