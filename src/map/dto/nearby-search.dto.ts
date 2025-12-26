import { IsNumber, IsOptional, IsArray, IsString, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class NearbySearchDto {
    @Type(() => Number)
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat: number;

    @Type(() => Number)
    @IsNumber()
    @Min(-180)
    @Max(180)
    lng: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(100)
    @Max(10000)
    radius?: number = 1000;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',').map((item) => item.trim());
        }
        return value;
    })
    @IsArray()
    @IsString({ each: true })
    amenities?: string[];
}
