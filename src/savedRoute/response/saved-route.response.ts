import { ToBoolean } from '@libs/common/decorators';
import { OmitMethod } from '@libs/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GeoPointResponse } from 'src/place/response';

export class CreatePlanResponse {
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

    @ApiProperty({ type: GeoPointResponse, required: false })
    @Type(() => GeoPointResponse)
    location?: GeoPointResponse;

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

    constructor(data: OmitMethod<CreatePlanResponse>) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.location = data.location;
        this.color = data.color;
        this.finished = data.finished;
        this.startTime = data.startTime;
    }
}

export class CreateRouteResponse {
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

    @ApiProperty({ type: [CreatePlanResponse], required: true })
    @Type(() => CreatePlanResponse)
    waypointsList!: CreatePlanResponse[];

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    color!: string;

    constructor(data: OmitMethod<CreateRouteResponse>) {
        this.id = data.id;
        this.name = data.name;
        this.distance = data.distance;
        this.duration = data.duration;
        this.waypointsList = data.waypointsList.map((plan) => new CreatePlanResponse(plan));
        this.color = data.color;
    }
}

export class CreateSavedRouteResponse {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ type: [CreateRouteResponse], required: true })
    @Type(() => CreateRouteResponse)
    route!: CreateRouteResponse[];

    constructor(data: OmitMethod<CreateSavedRouteResponse>) {
        this.userId = data.userId;
        this.route = data.route.map((route) => new CreateRouteResponse(route));
    }
}
