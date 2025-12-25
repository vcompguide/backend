import { OmitMethod } from '@libs/common/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WeatherModel, WeatherLocation, CurrentWeather } from '../weather.model';

export class WeatherLocationResponse extends WeatherLocation {
    @ApiProperty({ description: 'Latitude in decimal degrees', example: 52.52 })
    latitude: number;

    @ApiProperty({ description: 'Longitude in decimal degrees', example: 13.405 })
    longitude: number;

    @ApiPropertyOptional({ description: 'Name of the city or area', example: 'Berlin' })
    name?: string;

    @ApiPropertyOptional({ description: 'Country code or name', example: 'Germany' })
    country?: string;

    constructor(data: OmitMethod<WeatherLocationResponse>) {
        super();
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.name = data.name;
        this.country = data.country;
    }
}

export class CurrentWeatherResponse extends CurrentWeather {
    @ApiProperty({ description: 'Current temperature in Celsius', example: 18.5 })
    temperature: number;

    @ApiProperty({ description: 'Apparent temperature in Celsius', example: 17.0 })
    feelsLike: number;

    @ApiProperty({ description: 'Humidity percentage', example: 45, minimum: 0, maximum: 100 })
    humidity: number;

    @ApiProperty({ description: 'Atmospheric pressure in hPa', example: 1015 })
    pressure: number;

    @ApiProperty({ description: 'Wind speed in meters per second', example: 3.6 })
    windSpeed: number;

    @ApiProperty({ description: 'Wind direction in degrees (0-360)', example: 270 })
    windDirection: number;

    @ApiProperty({ description: 'Description of current weather', example: 'Clear sky' })
    description: string;

    @ApiProperty({ description: 'Weather icon code', example: '01d' })
    icon: string;

    constructor(data: OmitMethod<CurrentWeatherResponse>) {
        super();
        this.temperature = data.temperature;
        this.feelsLike = data.feelsLike;
        this.humidity = data.humidity;
        this.pressure = data.pressure;
        this.windSpeed = data.windSpeed;
        this.windDirection = data.windDirection;
        this.description = data.description;
        this.icon = data.icon;
    }
}

export class WeatherResponse extends WeatherModel {
    @ApiProperty({
        type: WeatherLocationResponse,
        description: 'Location details for the weather data',
    })
    location: WeatherLocationResponse;

    @ApiProperty({
        type: CurrentWeatherResponse,
        description: 'Current weather conditions',
    })
    current: CurrentWeatherResponse;

    @ApiProperty({
        description: 'The time when the weather data was recorded',
        example: '2023-10-27T14:30:00Z',
    })
    timestamp: Date;

    constructor(data: OmitMethod<WeatherResponse>) {
        super();
        this.location = new WeatherLocationResponse(data.location);
        this.current = new CurrentWeatherResponse(data.current);
        this.timestamp = data.timestamp;
    }
}
