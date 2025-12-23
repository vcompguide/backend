import { OmitMethod } from '@libs/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { WeatherLocationResponse } from './weather.response';
import { ForecastModel, ForecastPeriod } from '../forecast.model';

export class ForecastPeriodResponse implements ForecastPeriod {
    @ApiProperty({
        description: 'Label indicating the timeframe of the forecast',
        example: 'Next 3 Hours',
    })
    // FIX: Add '?' to make it optional for the constructor input
    descriptionLabel?: string;

    @ApiProperty() time!: string;
    @ApiProperty() timestamp!: number;
    @ApiProperty() temperature!: number;
    @ApiProperty() feelsLike!: number;
    @ApiProperty() humidity!: number;
    @ApiProperty() pressure!: number;
    @ApiProperty() windSpeed!: number;
    @ApiProperty() windDirection!: number;
    @ApiProperty() description!: string;
    @ApiProperty() icon!: string;
    @ApiProperty() precipitation!: number;
    @ApiProperty() clouds!: number;

    constructor(data: OmitMethod<ForecastPeriodResponse>) {
        Object.assign(this, data);
    }
}

export class ForecastResponse implements ForecastModel {
    @ApiProperty({ type: WeatherLocationResponse })
    location: WeatherLocationResponse;

    @ApiProperty({ type: [ForecastPeriodResponse] })
    forecasts: ForecastPeriodResponse[];

    @ApiProperty()
    retrievedAt: Date;

    constructor(data: OmitMethod<ForecastResponse>) {
        this.location = new WeatherLocationResponse(data.location);
        this.retrievedAt = data.retrievedAt;

        const labels = ['Next 3 Hours', 'Next 6 Hours', 'Next 12 Hours', 'Next 24 Hours'];

        // We map the incoming data (which lacks labels) to the Response Class
        // and inject the label here.
        this.forecasts = data.forecasts.map((period, index) => {
            return new ForecastPeriodResponse({
                ...period,
                descriptionLabel: labels[index] || 'Future Forecast',
            });
        });
    }
}
