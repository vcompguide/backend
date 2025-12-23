import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { GetForecastDto } from './dto/get-forecast.dto';
import { WeatherModel } from './weather.model';
import { ForecastModel } from './forecast.model';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get('current')
    async getCurrentWeather(@Query(new ValidationPipe({ transform: true })) dto: GetWeatherDto): Promise<WeatherModel> {
        return this.weatherService.getCurrentWeather(dto);
    }

    @Get('forecast')
    async getForecast(@Query(new ValidationPipe({ transform: true })) dto: GetForecastDto): Promise<ForecastModel> {
        return this.weatherService.getForecast(dto);
    }
}
