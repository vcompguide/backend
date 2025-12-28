import { OmitMethod } from '@libs/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { WeatherLocationResponse } from './weather.response';
import { ForecastModel, ForecastPeriod } from '../forecast.model';

export class ForecastPeriodResponse extends ForecastPeriod {
    @ApiProperty({
        description: 'Label indicating the timeframe of the forecast',
        example: 'Next 3 Hours',
    })
    descriptionLabel?: string;

    @ApiProperty({ description: 'ISO 8601 formatted date string', example: '2023-10-27T12:00:00Z' })
    declare time: string;

    @ApiProperty({ description: 'Unix timestamp in seconds', example: 1698408000 })
    declare timestamp: number;

    @ApiProperty({ description: 'Temperature in degrees Celsius', example: 22.5 })
    declare temperature: number;

    @ApiProperty({ description: 'Apparent "feels like" temperature in Celsius', example: 21.0 })
    declare feelsLike: number;

    @ApiProperty({ description: 'Humidity percentage', example: 65, minimum: 0, maximum: 100 })
    declare humidity: number;

    @ApiProperty({ description: 'Atmospheric pressure in hPa', example: 1013 })
    declare pressure: number;

    @ApiProperty({ description: 'Wind speed in meters per second', example: 5.4 })
    declare windSpeed: number;

    @ApiProperty({ description: 'Wind direction in degrees', example: 180, minimum: 0, maximum: 360 })
    declare windDirection: number;

    @ApiProperty({ description: 'Short text description of weather conditions', example: 'Partly Cloudy' })
    declare description: string;

    @ApiProperty({ description: 'Weather icon identifier or code', example: '04d' })
    declare icon: string;

    @ApiProperty({ description: 'Precipitation volume in mm', example: 0.5 })
    declare precipitation: number;

    @ApiProperty({ description: 'Cloudiness percentage', example: 75, minimum: 0, maximum: 100 })
    declare clouds: number;

    constructor(data: OmitMethod<ForecastPeriodResponse>) {
        super();
        // Explicit assignment as requested by the reviewer
        this.descriptionLabel = data.descriptionLabel;
        this.time = data.time;
        this.timestamp = data.timestamp;
        this.temperature = data.temperature;
        this.feelsLike = data.feelsLike;
        this.humidity = data.humidity;
        this.pressure = data.pressure;
        this.windSpeed = data.windSpeed;
        this.windDirection = data.windDirection;
        this.description = data.description;
        this.icon = data.icon;
        this.precipitation = data.precipitation;
        this.clouds = data.clouds;
    }
}

export class ForecastResponse extends ForecastModel {
    @ApiProperty({
        type: WeatherLocationResponse,
        description: 'Geographic and identifying information for the weather location',
    })
    location: WeatherLocationResponse;

    @ApiProperty({
        type: [ForecastPeriodResponse],
        description: 'A list of forecast periods (3h, 6h, 12h, 24h intervals)',
    })
    forecasts: ForecastPeriodResponse[];

    @ApiProperty({
        description: 'The timestamp when this data was fetched from the provider',
        example: '2023-10-27T10:00:00.000Z',
    })
    retrievedAt: Date;

    constructor(data: OmitMethod<ForecastResponse>) {
        super();
        // Explicitly instantiating nested classes
        this.location = new WeatherLocationResponse(data.location);
        this.retrievedAt = data.retrievedAt;

        // Updated labels to match your new requirements
        const labels = [
            'Next 3 Hours',
            'Next 6 Hours',
            'Next 12 Hours',
            'Next 1 Day',
            'Next 2 Days',
            'Next 3 Days',
            'Next 4 Days',
            'Next 5 Days',
        ];

        this.forecasts = data.forecasts.map((period, index) => {
            return new ForecastPeriodResponse({
                ...period,
                // Fallback to a generic label if the index exceeds the labels array
                descriptionLabel: labels[index] ?? `Day ${index - 2}`,
            });
        });
    }
}
