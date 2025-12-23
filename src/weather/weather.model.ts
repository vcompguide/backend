export class WeatherModel {
    location: {
        latitude: number;
        longitude: number;
        name?: string;
        country?: string;
    };

    current: {
        temperature: number;
        feelsLike: number;
        humidity: number;
        pressure: number;
        windSpeed: number;
        windDirection: number;
        description: string;
        icon: string;
    };

    timestamp: Date;
}
