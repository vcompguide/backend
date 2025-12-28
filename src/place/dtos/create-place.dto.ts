import { TransformToArray } from '@libs/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class GeoPointDto {
    @ApiProperty({ example: 10.7793648, required: true })
    @IsNumber()
    x!: number;

    @ApiProperty({ example: 106.6922806, required: true })
    @IsNumber()
    y!: number;
}

export class CreatePlaceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Name of the place', required: true, example: 'Vinhome Central Park' })
    name!: string;

    @ApiProperty({ type: GeoPointDto })
    @ValidateNested()
    @Type(() => GeoPointDto)
    location!: GeoPointDto;

    @ApiProperty({ example: 'museum, history', required: false, type: String })
    @IsOptional()
    @TransformToArray()
    tags?: string[];
}
