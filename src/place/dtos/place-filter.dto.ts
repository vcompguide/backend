import { TransformToArray } from '@libs/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class PlaceFilterDto {
    @ApiProperty({
        description: 'List of tags to filter places by',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsArray()
    @TransformToArray()
    readonly tags?: string[];
}
