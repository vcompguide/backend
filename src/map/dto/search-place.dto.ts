import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchPlaceDto {
    @ApiProperty({
        description: 'Search query for place name, address, or location',
        example: 'Eiffel Tower',
    })
    @IsString()
    q: string;

    @ApiProperty({
        description: 'Maximum number of results to return',
        minimum: 1,
        maximum: 50,
        default: 5,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(50)
    limit?: number = 5;
}
