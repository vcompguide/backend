import { IsNotEmpty, IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetForecastDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude: number;

    @IsOptional()
    @IsString()
    locationName?: string;
}
