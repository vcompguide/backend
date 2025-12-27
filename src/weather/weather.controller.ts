import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { GetForecastDto } from './dto/get-forecast.dto';
import { WeatherResponse } from './responses/weather.response';
import { ForecastResponse } from './responses/forecast.response';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get('current')
    @ApiOperation({
        summary: 'Get current weather',
        description: 'Retrieve the current weather conditions for a specific location.',
    })
    @ApiResponse({
        status: 200,
        description: 'Current weather retrieved successfully',
        type: WeatherResponse,
    })
    async getCurrentWeather(@Query() dto: GetWeatherDto): Promise<WeatherResponse> {
        const weatherData = await this.weatherService.getCurrentWeather(dto);
        return new WeatherResponse(weatherData);
    }

    @Get('forecast')
    @ApiOperation({
        summary: 'Get weather forecast',
        description: 'Retrieve a multi-day weather forecast for a specific location.',
    })
    @ApiResponse({
        status: 200,
        description: 'Weather forecast retrieved successfully',
        type: ForecastResponse,
    })
    async getForecast(@Query() dto: GetForecastDto): Promise<ForecastResponse> {
        const data = await this.weatherService.getForecast(dto);
        return new ForecastResponse(data);
    }
}
