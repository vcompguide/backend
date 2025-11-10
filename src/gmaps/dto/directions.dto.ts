import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class DirectionsDto {
    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    origin: LocationDto;

    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    destination: LocationDto;
}
