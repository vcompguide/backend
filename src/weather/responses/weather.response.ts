import { OmitMethod } from '@libs/common/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WeatherModel, WeatherLocation, CurrentWeather } from '../weather.model';

export class WeatherLocationResponse implements WeatherLocation {
    @ApiProperty() latitude: number;
    @ApiProperty() longitude: number;
    @ApiPropertyOptional() name?: string;
    @ApiPropertyOptional() country?: string;

    constructor(data: OmitMethod<WeatherLocationResponse>) {
        Object.assign(this, data);
    }
}

export class CurrentWeatherResponse implements CurrentWeather {
    @ApiProperty() temperature: number;
    @ApiProperty() feelsLike: number;
    @ApiProperty() humidity: number;
    @ApiProperty() pressure: number;
    @ApiProperty() windSpeed: number;
    @ApiProperty() windDirection: number;
    @ApiProperty() description: string;
    @ApiProperty() icon: string;

    constructor(data: OmitMethod<CurrentWeatherResponse>) {
        Object.assign(this, data);
    }
}

export class WeatherResponse implements WeatherModel {
    @ApiProperty({ type: WeatherLocationResponse })
    location: WeatherLocationResponse;

    @ApiProperty({ type: CurrentWeatherResponse })
    current: CurrentWeatherResponse;

    @ApiProperty()
    timestamp: Date;

    constructor(data: OmitMethod<WeatherResponse>) {
        this.location = new WeatherLocationResponse(data.location);
        this.current = new CurrentWeatherResponse(data.current);
        this.timestamp = data.timestamp;
    }
}
