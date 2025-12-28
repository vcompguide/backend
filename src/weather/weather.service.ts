import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GetWeatherDto } from './dto/get-weather.dto';
import { GetForecastDto } from './dto/get-forecast.dto';
import { WeatherModel } from './weather.model';
import { ForecastModel, ForecastPeriod } from './forecast.model';
import { ConfigService } from '@nestjs/config';
import { OpenWeatherCurrentResponse, OpenWeatherForecastResponse } from './types';

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

        if (!this.apiKey) {
            this.logger.error('OpenWeatherMap API key is not configured');
            throw new Error('Weather API key is missing from environment variables');
        }
    }

    async getCurrentWeather(dto: GetWeatherDto): Promise<WeatherModel> {
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
        try {
            this.logger.log(`Fetching forecast data for lat: ${dto.latitude}, lon: ${dto.longitude}`);

            const response = await firstValueFrom(
                this.httpService.get<OpenWeatherForecastResponse>(FORECAST_URL, {
                    params: {
                        lat: dto.latitude,
                        lon: dto.longitude,
                        appid: this.apiKey,
                        units: 'metric',
                    },
                }),
            );

            this.logger.log('Forecast data fetched successfully');

            /**
             * OPENWEATHER 5-DAY / 3-HOUR MAP:
             * Data points occur every 3 hours (8 points per day).
             * Index 0: +3h
             * Index 1: +6h
             * Index 3: +12h
             * Index 7: +24h (1 Day)
             * Index 15: +48h (2 Days)
             * Index 23: +72h (3 Days)
             * Index 31: +96h (4 Days)
             * Index 39: +120h (5 Days)
             */
            const targetIndices = [0, 1, 3, 7, 15, 23, 31, 39];

            const filteredList = targetIndices.map((index) => response.data.list[index]).filter(Boolean);

            const filteredData = {
                ...response.data,
                list: filteredList,
            };

            return this.mapToForecastModel(filteredData, dto);
        } catch (error) {
            // ... (Error handling remains the same)
            this.logger.error(`Error fetching forecast data: ${error.message}`);

            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) throw new HttpException('Invalid Weather API key', HttpStatus.UNAUTHORIZED);
                if (status === 404) throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
                if (status === 429) throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
            }

            throw new HttpException(`Weather Service unavailable: ${error.message}`, HttpStatus.BAD_GATEWAY);
        }
    }

    private mapToWeatherModel(data: OpenWeatherCurrentResponse, dto: GetWeatherDto): WeatherModel {
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

    private mapToForecastModel(data: OpenWeatherForecastResponse, dto: GetForecastDto): ForecastModel {
        return {
            location: {
                latitude: dto.latitude,
                longitude: dto.longitude,
                name: dto.locationName || data.city?.name,
                country: data.city?.country,
            },
            forecasts: data.list.map((item) => this.mapForecastPeriod(item)),
            retrievedAt: new Date(),
        };
    }

    private mapForecastPeriod(forecast: OpenWeatherForecastResponse['list'][0]): ForecastPeriod {
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
            precipitation: (forecast.pop || 0) * 100,
            clouds: forecast.clouds?.all || 0,
        };
    }
}
