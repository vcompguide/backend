import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchPlaceDto {
    @ApiProperty({
        description: 'Place name or address to search',
        example: 'New York',
    })
    @IsString()
    @IsNotEmpty()
    query: string;
}
