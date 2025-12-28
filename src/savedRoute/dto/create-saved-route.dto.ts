import { ToBoolean } from '@libs/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { GeoPointDto } from 'src/place/dtos/create-place.dto';

export class CreatePlanDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    id!: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiProperty({ type: GeoPointDto, required: false })
    @Type(() => GeoPointDto)
    @ValidateNested({ each: true })
    location?: GeoPointDto;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    color!: string;

    @ApiProperty({ type: Boolean, required: false })
    @IsBoolean()
    @ToBoolean()
    finished?: boolean;

    @ApiProperty({ type: Number, required: false })
    @IsNumber()
    startTime?: number;
}

export class CreateRouteDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    id!: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    distance!: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    duration!: string;

    @ApiProperty({ type: [CreatePlanDto], required: true })
    @Type(() => CreatePlanDto)
    @ValidateNested({ each: true })
    waypointsList!: CreatePlanDto[];

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    color!: string;
}

export class CreateSavedRouteDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ type: [CreateRouteDto], required: true })
    @Type(() => CreateRouteDto)
    @ValidateNested({ each: true })
    route!: CreateRouteDto[];
}
