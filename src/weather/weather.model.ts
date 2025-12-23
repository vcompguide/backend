export interface WeatherLocation {
    latitude: number;
    longitude: number;
    name?: string;
    country?: string;
}

export interface CurrentWeather {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    description: string;
    icon: string;
}

export interface WeatherModel {
    location: WeatherLocation;
    current: CurrentWeather;
    timestamp: Date;
}
