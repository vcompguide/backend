export class ForecastPeriod {
    time: string; // ISO 8601 format
    timestamp: number; // Unix timestamp
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    description: string;
    icon: string;
    precipitation: number; // Probability of precipitation (0-100%)
    clouds: number; // Cloudiness percentage
}

export class ForecastModel {
    location: {
        latitude: number;
        longitude: number;
        name?: string;
        country?: string;
    };

    forecasts: ForecastPeriod[];
    retrievedAt: Date;
}
