import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReverseGeocodeDto {
    @ApiProperty({
        description: 'Latitude coordinate',
        example: 40.7128,
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    lat: number;

    @ApiProperty({
        description: 'Longitude coordinate',
        example: -74.006,
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    lon: number;
}
