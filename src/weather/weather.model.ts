export class WeatherLocation {
    latitude: number;
    longitude: number;
    name?: string;
    country?: string;
}

export class CurrentWeather {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    description: string;
    icon: string;
}

export class WeatherModel {
    location: WeatherLocation;
    current: CurrentWeather;
    timestamp: Date;
}
