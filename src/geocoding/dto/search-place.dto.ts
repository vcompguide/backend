import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchPlaceDto {
    @ApiProperty({
        description: 'Place name or address to search',
        example: 'New York',
    })
    @IsString()
    @IsNotEmpty()
    query: string;
}
