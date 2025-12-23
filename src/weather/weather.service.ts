import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GetWeatherDto } from './dto/get-weather.dto';
import { GetForecastDto } from './dto/get-forecast.dto';
import { WeatherModel } from './weather.model';
import { ForecastModel, ForecastPeriod } from './forecast.model';
import { ConfigService } from '@nestjs/config';

const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

@Injectable()
export class WeatherService {
    private readonly logger = new Logger(WeatherService.name);
    private readonly apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY') || '';
        this.logger.log(`API Key configured: ${this.apiKey ? 'Yes' : 'No'}`);
    }

    async getCurrentWeather(dto: GetWeatherDto): Promise<WeatherModel> {
        if (!this.apiKey) {
            this.logger.error('OpenWeatherMap API key is not configured');
            throw new HttpException('Weather API key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            this.logger.log(`Fetching weather data for lat: ${dto.latitude}, lon: ${dto.longitude}`);

            const response = await firstValueFrom(
                this.httpService.get(CURRENT_WEATHER_URL, {
                    params: {
                        lat: dto.latitude,
                        lon: dto.longitude,
                        appid: this.apiKey,
                        units: 'metric',
                    },
                }),
            );

            this.logger.log('Weather data fetched successfully');
            return this.mapToWeatherModel(response.data, dto);
        } catch (error) {
            this.logger.error('Error fetching weather data:', error.message);

            if (error.response) {
                this.logger.error(`API Response Status: ${error.response.status}`);
                this.logger.error('API Response Data:', error.response.data);

                if (error.response.status === 401) {
                    throw new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED);
                }

                if (error.response.status === 404) {
                    throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
                }
            }

            throw new HttpException(`Failed to fetch weather data: ${error.message}`, HttpStatus.BAD_GATEWAY);
        }
    }

    async getForecast(dto: GetForecastDto): Promise<ForecastModel> {
        if (!this.apiKey) {
            this.logger.error('OpenWeatherMap API key is not configured');
            throw new HttpException('Weather API key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            this.logger.log(`Fetching forecast data for lat: ${dto.latitude}, lon: ${dto.longitude}`);

            const response = await firstValueFrom(
                this.httpService.get(FORECAST_URL, {
                    params: {
                        lat: dto.latitude,
                        lon: dto.longitude,
                        appid: this.apiKey,
                        units: 'metric',
                    },
                }),
            );

            this.logger.log('Forecast data fetched successfully');
            return this.mapToForecastModel(response.data, dto);
        } catch (error) {
            this.logger.error('Error fetching forecast data:', error.message);

            if (error.response) {
                this.logger.error(`API Response Status: ${error.response.status}`);
                this.logger.error('API Response Data:', error.response.data);

                if (error.response.status === 401) {
                    throw new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED);
                }

                if (error.response.status === 404) {
                    throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
                }
            }

            throw new HttpException(`Failed to fetch forecast data: ${error.message}`, HttpStatus.BAD_GATEWAY);
        }
    }

    private mapToWeatherModel(data: any, dto: GetWeatherDto): WeatherModel {
        return {
            location: {
                latitude: dto.latitude,
                longitude: dto.longitude,
                name: dto.locationName || data.name,
                country: data.sys?.country,
            },
            current: {
                temperature: data.main.temp,
                feelsLike: data.main.feels_like,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind.speed,
                windDirection: data.wind.deg,
                description: data.weather[0]?.description || '',
                icon: data.weather[0]?.icon || '',
            },
            timestamp: new Date(),
        };
    }

    private mapToForecastModel(data: any, dto: GetForecastDto): ForecastModel {
        const now = Date.now() / 1000; // Current time in Unix timestamp

        // OpenWeatherMap returns forecasts in 3-hour intervals
        const forecasts = data.list;

        // Find the closest forecast for each time period
        const next3Hours = this.findClosestForecast(forecasts, now + 3 * 3600);
        const next6Hours = this.findClosestForecast(forecasts, now + 6 * 3600);
        const next12Hours = this.findClosestForecast(forecasts, now + 12 * 3600);
        const next24Hours = this.findClosestForecast(forecasts, now + 24 * 3600);

        return {
            location: {
                latitude: dto.latitude,
                longitude: dto.longitude,
                name: dto.locationName || data.city?.name,
                country: data.city?.country,
            },
            forecasts: {
                next3Hours: this.mapForecastPeriod(next3Hours),
                next6Hours: this.mapForecastPeriod(next6Hours),
                next12Hours: this.mapForecastPeriod(next12Hours),
                next24Hours: this.mapForecastPeriod(next24Hours),
            },
            retrievedAt: new Date(),
        };
    }

    private findClosestForecast(forecasts: any[], targetTimestamp: number): any {
        return forecasts.reduce((closest, forecast) => {
            const forecastTime = forecast.dt;
            const closestTime = closest.dt;

            return Math.abs(forecastTime - targetTimestamp) < Math.abs(closestTime - targetTimestamp)
                ? forecast
                : closest;
        });
    }

    private mapForecastPeriod(forecast: any): ForecastPeriod {
        return {
            time: new Date(forecast.dt * 1000).toISOString(),
            timestamp: forecast.dt,
            temperature: forecast.main.temp,
            feelsLike: forecast.main.feels_like,
            humidity: forecast.main.humidity,
            pressure: forecast.main.pressure,
            windSpeed: forecast.wind.speed,
            windDirection: forecast.wind.deg,
            description: forecast.weather[0]?.description || '',
            icon: forecast.weather[0]?.icon || '',
            precipitation: forecast.pop * 100, // Probability of precipitation
            clouds: forecast.clouds.all,
        };
    }
}
