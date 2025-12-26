export class RouteResponse {
    success: boolean;
    data: {
        geometry: any;
        distance: number;
        duration: number;
        steps: Array<{
            distance: number;
            duration: number;
            instruction: string;
            name: string;
            mode: string;
        }>;
        summary?: {
            totalDistance: string;
            totalTime: string;
            mainRoads: string[];
            warnings?: string[];
        };
    };
}
