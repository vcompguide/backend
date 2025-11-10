import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer'
import { LocationDto } from './location.dto';
import { PlaceType2 } from '@googlemaps/google-maps-services-js';

const supportedPlaceTypes = [
    'restaurant',
    'hotel', // for "stays"
    'bus_station', // for "public transportation"
    'train_station',
    'subway_station',
    'cafe', // for "food, drink"
    'bar', // for "food, drink"
    'store', // for "food, drink"
];

export class NearbyPlacesDto {
    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @IsString()
    @IsEnum(supportedPlaceTypes, {
        message: `Type must be one of: ${supportedPlaceTypes.join(', ')}`,
    })
    type: PlaceType2;

    @IsNumber()
    @IsOptional()
    radius?: number;
}